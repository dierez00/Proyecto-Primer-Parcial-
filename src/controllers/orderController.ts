import { Request, Response } from "express";
import { Orden, IOrden } from "../models/ordenes";

export const crearOrden = async (req: Request, res: Response) => {
  try {
    const { userId, products, status } = req.body;

    const subtotal = products.reduce((acc: number, p: any) => acc + p.quantity * p.price, 0);
    const totalPrice = subtotal * 1.16; 

    const nuevaOrden = new Orden({
      userId,
      products,
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
