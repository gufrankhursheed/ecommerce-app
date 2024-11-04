import connect from "@/connection/mongoDB";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { title, category, description, price, images } = await request.json();
        await connect();
        await Product.create({
            title,
            category,
            description,
            price,
            images
        });
        return NextResponse.json({ message: "Product created" }, { status: 201 })
    } catch (error) {
        console.error("Error creating product:", error); // Log the actual error
        return NextResponse.json({ message: "Product not created" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connect();
        const products = await Product.find({});
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ message: "Could not fetch products" }, { status: 500 });
    }
}