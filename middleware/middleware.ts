// middlewares.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const config = require('config');
import redisClient from '../redis';

async function authenticateToken(req:any, res:any, next: NextFunction) {
  // console.log('req.headers 111',req.headers);
  
  const token = req.headers.authorization?.split(' ')[1]
  // console.log('token',token);
  
  if (!token) return res.status(401).json({ message: 'Authentication token missing.' });

  const value = await redisClient.exists(`blacklist:${token}`);
  // console.log('value',value);
  
  if(value) return res.status(401).send({message:"blacklisted token"});

  jwt.verify(token, config.get('JWT_SECRET'), (err:any, user:any) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
}

export default {                                                                                    
  authenticateToken
}