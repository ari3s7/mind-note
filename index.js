const express = require('express');
import { z } from "zod";
const app = express();

const PORT = 3000;

app.use(express.json());


const signUp = z.object ({
    username: z.string().min(3).max(10),
    password: z.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
});

app.post("/api/v1/signup", (req,res) => {
    
    try {
   const validateData = signUp.parse(req.body);

   res.status(200).json({message: "user succesfully signed up"})
   }
    catch (err) {
        
    }

})


app.listen(PORT);