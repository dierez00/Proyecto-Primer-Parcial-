import { Document, model, Schema, Types } from "mongoose";

export interface IProductos extends Document {
    id: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    stock: number;
}

const ProductosSchema = new Schema<IProductos>({
    id: { type: Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});

export const Productos = model<IProductos>("Productos", ProductosSchema, "productos");