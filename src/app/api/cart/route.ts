import connect from "@/connection/mongoDB";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connect(); 

        const { ids } = await request.json(); 
        const products = await Product.find({ _id: { $in: ids } }); 

        return NextResponse.json(products, { status: 200 });  
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ message: "Could not fetch products" }, { status: 500 });
    }
}