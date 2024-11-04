import connect from "@/connection/mongoDB";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

interface ProductImage {
    id: string;
    src: string;
    _id: string;
}

interface Product {
    _id: string;
    title: string;
    category: string;
    description: string;
    price: number;
    images: ProductImage[];
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export async function POST(req: NextRequest) {
    try {
        const { email, name, address, city, state, zip, cartProducts } = await req.json();
        await connect()
        const productIds: string[] = cartProducts
        const uniqueIds: string[] = [...new Set(productIds)]

        const productsInfo: Product[] = await Product.find({ _id: uniqueIds })

        let line_items = []

        for (const productId of uniqueIds) {
            const productInfo = productsInfo.find(p => p._id.toString() === productId)

            const quantity = productIds.filter(id => id === productId)?.length || 0;

            if (quantity > 0 && productInfo) {
                line_items.push({
                    quantity,
                    price_data: {
                        currency: 'inr',
                        product_data: { name: productInfo.title },
                        unit_amount: quantity * productInfo.price * 100,
                    }
                })
            }
        }

        const orderDoc = await Order.create({
            line_items,
            email,
            name,
            address,
            city,
            state,
            zip,
            paid: false,
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.BASE_URL}/cart?success=true`, 
            cancel_url: `${process.env.BASE_URL}/cart?canceled=true`,
            metadata: { orderId: orderDoc._id.toString() },
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({ message: "checkout action failed" }, { status: 500 });
    }
}