import express from 'express';
import z from 'zod';
import jwt from "jsonwebtoken";
import { UserModel } from './db.js';
import  bcrypt  from "bcryptjs";
const app = express();

const PORT = 3000;

app.use(express.json());



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
    }
        const username = req.body.username;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 5);

        const user = await UserModel.create({
        username: username,
        password: hashedPassword,
})
})

app.post("/api/v1/signin", (req, res) => {

})


app.post("/api/v1/content", (req, res) => {

})

app.get("/api/v1/content", (req,res) => {

})

app.delete("/api/v1/content", (req, res) => {

})

app.post("api/v1/brain/share", (req, res) => {

})

app.get("./api/v1/brain/:shareLink", (req, res) => {
    
})

app.listen(PORT);