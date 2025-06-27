import { Menu } from '../models/menu';
import { Roles } from '../models/roles'; 

export const getMenus = async (req: any, res: any) => {
  try {
    const menus = await Menu.find().populate('roles', 'type');
    res.json(menus);
  } catch (error) {
    console.error("Error al obtener menús", error);
    res.status(500).json({ message: "Error al obtener menús" });
  }
}

export const getMenuByRol = async (req: any, res: any) => {
  const { roles } = req.body;

  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: "Falta el parámetro 'roles'" });
  }

  try {
    // Buscar todos los roles que coincidan con los types enviados
    const rolesEncontrados = await Roles.find({ type: { $in: roles } });

    if (!rolesEncontrados || rolesEncontrados.length === 0) {
      return res.status(404).json({ message: "No se encontraron roles válidos" });
    }

    // Obtener los ObjectId de esos roles
    const roleIds = rolesEncontrados.map(role => role._id);

    // Buscar menús que incluyan al menos uno de esos roles
    const menus = await Menu.find({ roles: { $in: roleIds } }).populate('roles', 'type');

    if (!menus || menus.length === 0) {
      return res.status(404).json({ message: "No hay menús para los roles dados" });
    }

    res.json(menus);

  } catch (error) {
    console.error("Error al obtener menú por roles:", error);
    res.status(500).json({ message: "Error al obtener menú por roles" });
  }
};



export const createMenu = async (req: any, res: any) => {
  const { title, path, icon, roles } = req.body;
  if (!title || !path || !icon || !roles) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }
  try {
    const newMenu = new Menu({ title, path, icon, roles });
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    console.error("Error al crear menú", error);
    res.status(500).json({ message: "Error al crear menú" });
  }
}

export const updateMenu = async (req: any, res: any) => {
  const { id } = req.params;
  const { title, path, icon, roles } = req.body;
  if (!title || !path || !icon || !roles) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(id, { title, path, icon, roles }, { new: true });
    if (!updatedMenu) {
      return res.status(404).json({ message: "Menú no encontrado" });
    }
    res.json(updatedMenu);
  } catch (error) {
    console.error("Error al actualizar menú", error);
    res.status(500).json({ message: "Error al actualizar menú" });
  }
}

export const deleteMenu = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const deletedMenu = await Menu.findByIdAndDelete(id);
    if (!deletedMenu) {
      return res.status(404).json({ message: "Menú no encontrado" });
        }
}
    catch (error) {
    console.error("Error al eliminar menú", error);
    res.status(500).json({ message: "Error al eliminar menú" });
  }
};