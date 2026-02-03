import express from 'express';
import z from 'zod';
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from './db.js';
import { connectDB } from "./db.js";
import  bcrypt  from "bcryptjs";
import dotenv from "dotenv";
import { userMiddleware, } from './middleware.js';
import type { AuthRequest } from "./middleware.js";
import { nanoid } from "nanoid";
import { authRateLimiter, apiRateLimiter } from "./rateLimiter.js";
import cors from "cors";

dotenv.config();

await connectDB();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}



app.post("/api/v1/signup",authRateLimiter, async (req,res) => {


     const signUp = z.object ({
    username: z.string().min(3).max(10),
    password: z.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
});


    const validateData = signUp.safeParse(req.body);

    if (!validateData.success) {
        res.status(403).json({
            message: "not correct format"
        })
        return
    } 
        const username = req.body.username;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 5);
      try{
        await UserModel.create({
        username: username,
        password: hashedPassword,
     })
        res.status(200).json({
        message: "successfully created the user"
    })
    }
    catch (err) {
      console.error("error creating user", err);

      res.status(500).json ({
        message: "something went wrong"
      })
    }
})

app.post("/api/v1/signin", authRateLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET!);

    res.json({ token });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/v1/content", userMiddleware, async (req: AuthRequest, res) => {
   const link = req.body.link;
   const type = req.body.type;
   const title = req.body.title;
   await ContentModel.create ({
    link,
    type,
    title,
    userId: req.userId, 
    tags: [],
   })

   return res.json ({
    message: "Content added"
   })
})

app.get("/api/v1/content", userMiddleware, async (req: AuthRequest,res) => {
  
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId
  }).populate("userId", "username")
  res.json({
    content
  })


})

app.delete("/api/v1/content", userMiddleware, async (req: AuthRequest, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    _id: contentId,
    userId: req.userId
  })

  res.json ({
    message: "Deleted"
  })
   
})

app.post("/api/v1/brain/share", userMiddleware, async (req: AuthRequest, res) => {
   const { contentId } = req.body;

   const content = await ContentModel.findOne({
    _id: contentId,
    userId: req.userId 
   })

   if (!content) {
    res.status(404).json({
      message: "Content not found"
    });
   }
   let link = await LinkModel.findOne ({
    contentId,
    userId: req.userId
   });

   if(!link) {
    const hash = nanoid(10);
    link = await LinkModel.create ({
      hash,
      userId: req.userId,
      contentId,
    });
   }

   const shareURL = `${process.env.FRONTEND_URL}/api/v1/brain/${link.hash}`
   res.json({shareURL})
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const { shareLink } = req.params;

    const link = await LinkModel.findOne({
      hash: shareLink,
    }).populate("contentId")
    .populate("userId", "username");

     if (!link) {
    return res.status(404).json({ message: "Shared content not found" });
  }

  res.json({
    content: link.contentId,
  });
})

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
