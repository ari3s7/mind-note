const express = require('express');
import { z } from "zod";
const app = express();

const PORT = 3000;


const signUp = z.object ({
    username: z.string().min(3).max(10),
    password: z.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
});

app.post("/api/v1/signup", (req,res) => {
    
    const email = req.body.email;
    const password = req.body.password;


})


app.listen(PORT);