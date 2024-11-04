import connect from "@/connection/mongoDB";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connect();
        const newProducts = await Product.find({}, null, { sort: { '_id': 1 }, limit: 5 });
        return NextResponse.json(newProducts, { status: 200 });
    } catch (error) {
        console.error("Error fetching latest products:", error);
        return NextResponse.json({ message: "Could not fetch latest products" }, { status: 500 });
    }
}
