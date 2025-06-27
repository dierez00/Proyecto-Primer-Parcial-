import { Request, Response } from "express";
import { generateAccessToken } from "../utils/generateToken";
import { cache } from "../utils/cache";
import dayjs from "dayjs";
import { User } from "../models/User";
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscamos al usuario y populamos los roles
    const user = await User.findOne({ email }).populate("roles");

    if (!user) {
      return res.status(401).json({ message: "credenciales incorrectas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "credenciales incorrectas" });
    }

    const accessToken = generateAccessToken(user.id);
    cache.set(user.id, accessToken, 60 * 30);

    return res.json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles, // ← ahora esto contiene objetos completos, no solo ObjectIds
      },
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};


export const getTimeToken = (req: Request, res: Response) => {
  const { userId } = req.query;

  if (typeof userId !== 'string') {
    return res.status(400).json({ message: "Parámetro 'userId' inválido o ausente" });
  }

  const ttl = cache.getTtl(userId);
  if (!ttl) {
    return res.status(404).json({ message: "Token no existe" });
  }

  const now = Date.now();
  const timeToLife = Math.floor((ttl - now) / 1000);
  const expTime = dayjs(ttl).format("HH:mm:ss");

  return res.json({ timeToLife, expTime });
};

export const updateToken = (req: Request, res: Response) => {
  const { userId } = req.params;

  const ttl = cache.getTtl(userId);
  if (!ttl){
    return res.status(404).json({ message: "Token no existe" });
  }

  const newTImeTll: number = 60 * 15;
  cache.ttl(userId, newTImeTll);

  return res.json({ message: "Token actualizado" });
};
