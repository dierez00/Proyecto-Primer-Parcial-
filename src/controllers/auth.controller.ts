import express, { Request, Response } from "express";
import { generateAccessToken } from "../utils/generateToken";
import NodeCache from "node-cache";
import { cache } from "../utils/cache"; // Este debe ser una instancia compartida
import dayjs from "dayjs"; // era incorrecto usar `import {days}`

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username !== "admin" || password !== "admin") {
    return res.status(401).json({ message: "Credenciales Incorrectas" });
  }

  const userId = "123456";
  const accessToken = generateAccessToken(userId);

  // ⚠️ Se recomienda usar una sola instancia de cache compartida, no crear una nueva aquí
  cache.set(userId, accessToken, 60 * 15); // TTL en segundos

  res.json({ accessToken });
};

export const getTimeToken = (req: Request, res: Response) => {
  const { userId } = req.query;

  if (typeof userId !== 'string') {
    return res.status(400).json({ message: "Parámetro 'userId' inválido o ausente" });
  }

  const ttl = cache.getTtl(userId); // ⚠️ key sensible a mayúsculas
  if (!ttl) {
    return res.status(404).json({ message: "Token no existe" });
  }

  const now = Date.now();
  const timeToLife = Math.floor((ttl - now) / 1000); // en segundos
  const expTime = dayjs(ttl).format("HH:mm:ss");

  return res.json({ timeToLife, expTime });
};


export const updateToken = (req: Request, res: Response) => {
  const { userId } = req.params;

  const ttl = cache.getTtl(userId); // ⚠️ key sensible a mayúsculas


  if (!ttl){
    return res.status(404).json({ message: "Token no existe" });
  }
  const newTImeTll: number = 60 * 15; // 15 minutos
  cache.ttl(userId, newTImeTll); // Actualiza el TTL del token

  return res.json({ message: "Token actualizado" });
}