import { Document, model, Schema, Types } from "mongoose";

export interface IRoles extends Document {
    idRole: Types.ObjectId;
    type: string;
}

const RolesSchema = new Schema<IRoles>({
    idRole: { type: Schema.Types.ObjectId, required: true, auto: true },
    type: { type: String, required: true }
});

export const Roles = model<IRoles>("Roles", RolesSchema, "roles");