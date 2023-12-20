import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const key = process.env.SECRET_KEY;

export const signToken = (data) => {
  const token = jwt.sign(data, key);
  return token;
};

export const verifyTokenMiddleware = (req, res, next) => {
   const token = req.headers.authorization;
 
   if (!token) {
     return res.status(401).json({ error: "Unauthorized: Token missing" });
   }
   try {
     const decoded = jwt.verify(token.replace("Bearer ", ""), key);
     req.userData = decoded.data;
     console.log(decoded.data)
     next(); 
   } catch (error) {
     return res.status(401).json({ error: "Unauthorized: Invalid token" });
   }
   
 };


