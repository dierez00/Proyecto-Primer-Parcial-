import express from "express";
import { generateAccessToken } from "../utils/generateToken";
import NodeCache from 'node-cache';

export const login=(req: express.Request, res:express.Response)=>{
    const {username,password}=req.body;
    if (username !== 'admin' || password !== 'admin') {
        return res.status(401)
            .json({message:"Credenciales Incorrectas"});
    }
    const userId = '123456';
    const accessToken = generateAccessToken(userId);
    const cache = new NodeCache();
    cache.set(userId, accessToken, 60 * 15);
    res.json({accessToken});
}