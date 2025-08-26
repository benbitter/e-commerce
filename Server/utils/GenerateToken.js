
import dotenv from "dotenv";

dotenv.config({path : "./.env"});

import jwt from "jsonwebtoken"


const generateToken=(payload,passwordReset=false)=>{
    return jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'1d'})
}

export { generateToken };
