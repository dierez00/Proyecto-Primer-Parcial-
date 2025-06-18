import { Request, Response } from "express";
import { Productos } from "../models/productos";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Productos.find();
    return res.json({ products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return res.status(500).json({ error: "Error al obtener los productos" });
  }
};

export const saveProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, stock } = req.body;

    const newProduct = new Productos({
      name,
      price,
      description,
      stock,
      createDate: Date.now(),
      status: true,
    });

    const product = await newProduct.save();
    return res.json({ product });
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    return res.status(500).json({ error: "Error al guardar el producto" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description, stock } = req.body;

    const updatedProduct = await Productos.findByIdAndUpdate(
      id,
      { name, price, description, stock },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.json({ product: updatedProduct });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Productos.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.json({ message: "Producto desactivado correctamente", product: deletedProduct });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

