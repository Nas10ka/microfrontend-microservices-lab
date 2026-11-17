import { Schema, model, Document } from 'mongoose';

export interface IItem extends Document {
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>({
  title: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default model<IItem>('Item', ItemSchema);
