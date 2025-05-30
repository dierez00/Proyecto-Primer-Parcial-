import { Document, model, Schema, Types } from "mongoose";

export interface IOrden extends Document {
    userId: Types.ObjectId;
    productIds: Types.ObjectId[]; // ahora es un array
    totalPrice: number;
    subtotal: number;
    orderDate: Date;
    status: "pending" | "shipped" | "delivered" | "cancelled";
}

const OrdenSchema = new Schema<IOrden>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    productIds: [{ type: Schema.Types.ObjectId, required: true, ref: "Product" }], // array de referencias
    totalPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: {
        type: String,
        required: true,
        enum: ["pending", "shipped", "delivered", "cancelled"]
    }
});

export const Orden = model<IOrden>("Orden", OrdenSchema, "ordenes");
