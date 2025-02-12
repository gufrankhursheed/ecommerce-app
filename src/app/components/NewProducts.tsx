"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import Image from "next/image";

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


export default function NewProducts() {
    const { addProduct } = useCart();
    const [newProducts, setNewProucts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const response = await fetch('/api/products/latest');
                if (!response.ok) {
                    throw new Error('Failed to fetch latest products');
                }
                const data = await response.json();
                setNewProucts(data)
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestProducts()
    }, [])

    if (loading) {
        return (
            <div className='flex items-center justify-center w-screen h-screen'>
                <Spinner />
            </div>
        );
    }

    if (newProducts) {
        return <>
            <div className="mt-7 mx-auto px-5 md:pl-10 md:py-10">
                <h1 className="text-3xl font-bold tracking-tighter  text-gray-900 mt-3 ">
                    Our latest Products
                </h1>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
                    {newProducts?.length > 0 && newProducts.map((product) => (
                        <div className="group relative" key={product._id}>
                            <div className="group block overflow-hidden border border-gray-800  rounded-xl border-opacity-10">
                                <Link href={`/products/${product._id}`}>
                                    <div className="relative h-[300px] sm:h-[300px] border-b">
                                        <Image src={product.images[0].src} alt="img" width={300} height={320} className="absolute inset-0 h-full w-full object-contain opacity-100 hover:opacity-0" />
                                        <Image src={product.images[1].src} alt="img" width={300} height={320} className="absolute inset-0 h-full w-full object-contain opacity-0 hover:opacity-100" />
                                    </div>

                                    <h3 className="mt-2 p-2 text-md text-gray-700 group-hover:underline group-hover:underline-offset-4">
                                        {product.title}
                                    </h3>
                                </Link>
                                <div className="relative flex items-center lg:justify-between p-2">
                                    <Link href={`/products/${product._id}`}>
                                        <div className=" mt-1 flex items-center justify-between text-gray-700">
                                            <p className="text-orange-500">
                                                Rs: {product.price}
                                            </p>
                                        </div>
                                    </Link>
                                    <button type="button" onClick={() => { addProduct(product._id); toast.success('Item added to cart') }} className="inline-flex items-center gap-1.5 rounded-lg border ml-28 md:ml-56 lg:mx-0 px-2 py-2.5  border-orange-500 bg-orange-500 text-white transition hover:border-orange-400 hover:bg-orange-400 text-center text-sm font-medium shadow-sm focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400">
                                        Add to Cart
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>

                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    }

    return null;
}
