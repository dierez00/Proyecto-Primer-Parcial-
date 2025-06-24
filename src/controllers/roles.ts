import { Roles } from "../models/roles";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Roles.find();
    res.json(roles);
  } catch (error) {
    console.error("Error al obtener roles", error);
    res.status(500).json({ message: "Error al obtener roles" });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { type } = req.body;
  if (!type) {
    return res.status(400).json({ message: "El tipo de rol es requerido" });
  }
  try {
    const newRole = new Roles({ type });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    console.error("Error al crear rol", error);
    res.status(500).json({ message: "Error al crear rol" });
  }
}
