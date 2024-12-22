import { model, models, Schema } from "mongoose";

const ImageSchema = new Schema({
    id: { type: String, required: true },
    src: { type: String, required: true },
  });

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [ImageSchema],
    stock: {
        type: Number, 
        required: true, 
        default: 0 
    }
})

export const Product = models.Product || model('Product',ProductSchema)