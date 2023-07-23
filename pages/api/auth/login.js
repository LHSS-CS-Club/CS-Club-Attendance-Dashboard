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

    if (user) {
      const token = sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
          email: email
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
      return res.status(401).json({
        message: "Invalid Credentials",
        type: "error",
      });
    }
}