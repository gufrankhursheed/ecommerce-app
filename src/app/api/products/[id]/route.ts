import connect from "@/connection/mongoDB";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
        }

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ message: "Could not fetch product" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connect();
        const { id } = await params;
        const updateData = await request.json();
        
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        });

        if (!updatedProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ message: "Could not update product" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, {params}:{params:{id: string}}) {
    try {
        await connect();
        const {id} = await params

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
        }

        const deleteProduct = await Product.findByIdAndDelete(id)

        if(!deleteProduct){
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ message: "Could not delete product" }, { status: 500 });
        
    }


}