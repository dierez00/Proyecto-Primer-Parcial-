import { Request, Response } from "express";
import { Orden, IOrden } from "../models/ordenes";
import { Productos } from "../models/productos";
import mongoose from "mongoose";

export const crearOrden = async (req: Request, res: Response) => {
  try {
    const { userId, products, status } = req.body;

    // Validación básica
    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Datos incompletos: userId y products son requeridos." });
    }

    // Array donde vamos a armar los productos con precio correcto
    const productosConPrecio = [];

    let subtotal = 0;

    for (const item of products) {
      const { productId, quantity } = item;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: `ID de producto inválido: ${productId}` });
      }

      const productoDB = await Productos.findById(productId);

      if (!productoDB || !productoDB.status) {
        return res.status(404).json({ error: `Producto no encontrado o inactivo: ${productId}` });
      }

      // 🛑 Verificar stock suficiente
      if (productoDB.stock < quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para el producto ${productoDB.name}`,
          disponible: productoDB.stock,
          solicitado: quantity
        });
      }

      // ✅ Restar stock y guardar
      productoDB.stock -= quantity;
      await productoDB.save();

      const precioReal = productoDB.price;
      const totalPorProducto = precioReal * quantity;

      productosConPrecio.push({
        productId,
        quantity,
        price: precioReal
      });

      subtotal += totalPorProducto;
    }

    const totalPrice = subtotal * 1.16; // IVA del 16%

    const nuevaOrden = new Orden({
      userId,
      products: productosConPrecio,
      subtotal,
      totalPrice,
      status
    });

    const ordenGuardada = await nuevaOrden.save();
    res.status(201).json(ordenGuardada);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la orden", details: error });
  }
};


export const obtenerOrdenes = async (_: Request, res: Response) => {
  try {
    const ordenes = await Orden.find({ deleteDate: null }).populate("userId").populate("products.productId");
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las órdenes", details: error });
  }
};

export const obtenerOrdenPorId = async (req: Request, res: Response) => {
  try {
    const orden = await Orden.findById(req.params.id).populate("userId").populate("products.productId");
    if (!orden || orden.deleteDate) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar la orden", details: error });
  }
};

export const actualizarOrden = async (req: Request, res: Response) => {
  try {
    const { products, status } = req.body;

    const subtotal = products.reduce((acc: number, p: any) => acc + p.quantity * p.price, 0);
    const totalPrice = subtotal * 1.16;

    const ordenActualizada = await Orden.findByIdAndUpdate(
      req.params.id,
      { products, subtotal, totalPrice, status },
      { new: true }
    );

    if (!ordenActualizada) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(ordenActualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la orden", details: error });
  }
};

export const eliminarOrden = async (req: Request, res: Response) => {
  try {
    const ordenEliminada = await Orden.findByIdAndUpdate(
      req.params.id,
      { deleteDate: new Date() },
      { new: true }
    );

    if (!ordenEliminada) return res.status(404).json({ error: "Orden no encontrada" });
    res.json({ mensaje: "Orden eliminada correctamente (soft delete)" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la orden", details: error });
  }
};
