import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from 'bcryptjs';

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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name: name2,
      email,
      password: hashedPassword,
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

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

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
