import express, { Request, Response } from "express";
import { generateAccessToken } from "../utils/generateToken";
import NodeCache from "node-cache";
import { cache } from "../utils/cache"; // Este debe ser una instancia compartida
import dayjs from "dayjs"; // era incorrecto usar `import {days}`
import { User } from "../models/User";
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "credenciales incorrectas" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "credenciales incorrectas" });
        }

        // Generate access token
        const accessToken = generateAccessToken(user.id);

        // Store token in cache with 30 minutes expiration
        cache.set(user.id, accessToken, 60 * 30);

        // Return success response with token
        return res.json({ 
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
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

export const getAllUsers = async (req: Request, res: Response ) =>{
  const { userEmail } = req.query;
  const userList = await User.find(); //FIND .> Encontrar todos los registros
  const userByEmail = await User.find({status: true}); //Encontrar por una caracteristica en especial

  console.log(userByEmail)
  return res.json({userList});
}

export const saveUsers = async (req: Request, res: Response) => {
  try {
    const { name2, email, password, role, phone } = req.body;

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name: name2,
      email,
      password: hashedPassword,  // Guardar la contraseña encriptada
      role,
      phone,
      createDate: Date.now(),
      status: true,
    });

    const user = await newUser.save();

    return res.json({ user });
  } catch (error) {
    console.log("Error al guardar el usuario:", error);
    return res.status(426).json({ error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, role, phone } = req.body;

    // Buscar el usuario
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos si están presentes
    if (name) user.name = name;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await user.save();
    return res.json({ user: updatedUser });
    
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndUpdate(
            id,
            {
                status: false,
                deleteDate: new Date()
            },
            { new: true }
        );

        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json({ message: 'Usuario desactivado', deletedUser });

    } catch (error) {
        console.log("Error en deleteUser: ", error);
        return res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};