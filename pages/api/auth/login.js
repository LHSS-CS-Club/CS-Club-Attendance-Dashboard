import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

import connect from "../../../lib/mongodb";
import User from '../../../model/schema';
import Link from "next/link";

// auth/api/login

const secret = process.env.SECRET;
connect();

export default async function handler(req,res){
    const {email,password}=req.body
    console.log(email, password)
    const user = await User.findOne({email, password})
    console.log(user);

    if (!user)
      return res.status(500).json({
        message: "User doesn't exist! 😢",
        type: "error",
      });
    
    // const isMatch = await compare(password, user.password);

    // if (!isMatch)
    //   return res.status(500).json({
    //     message: "Password is incorrect! ⚠️",
    //     type: "error",
    //   });

    console.log("USER", user)
    if(!user){
        return res.json({status:'Not able to find the user'})
    }
    else{
        console.log("HI")
        return res.json({status:'Logged In', data: user})
        // res.redirect('/home', user)
    }

    if (username === "Admin" && password === "Admin") {
      const token = sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
          username: username,
        },
        secret
      );
  
      const serialised = serialize("OursiteJWT", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
  
      res.setHeader("Set-Cookie", serialised);
  
      res.status(200).json({ message: "Success!" });
    } else {
      res.json({ message: "Invalid credentials!" });
    }
}