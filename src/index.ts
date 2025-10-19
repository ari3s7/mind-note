import express from 'express';
import z from 'zod';
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from './db.js';
import  bcrypt  from "bcryptjs";
import dotenv from "dotenv";
import { userMiddleware } from './middleware.js';
dotenv.config();

const app = express();

const PORT = 3000;

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;


app.post("/api/v1/signup", async (req,res) => {


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

app.post("/api/v1/signin", async (req, res) => {
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

app.post("/api/v1/content", userMiddleware, async (req, res) => {
   const link = req.body.link;
   const type = req.body.type;
   const title = req.body.title;
   await ContentModel.create ({
    link,
    type,
    title,
    //@ts-ignore
    userId: req.userId, 
    tags: [],
   })

   return res.json ({
    message: "Content added"
   })
})

app.get("/api/v1/content", userMiddleware, (req,res) => {

})

app.delete("/api/v1/content", (req, res) => {

})

app.post("api/v1/brain/share", (req, res) => {

})

app.get("./api/v1/brain/:shareLink", (req, res) => {
    
})

app.listen(PORT);