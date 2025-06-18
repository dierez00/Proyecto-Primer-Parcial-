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
