import express from 'express';
import z from 'zod';
import jwt from "jsonwebtoken";
const app = express();

const PORT = 3000;

app.use(express.json());


const signUp = z.object ({
    username: z.string().min(3).max(10),
    password: z.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
});

app.post("/api/v1/signup", (req,res) => {
    
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