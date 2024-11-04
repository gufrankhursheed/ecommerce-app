"use client";

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


export default function Hero() {

    const featuredId = "67236e7c5db9d3033222f6e4";

    const { addProduct } = useCart();
    const [featuredProduct, setFeaturedProduct] = useState<Product>()
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${featuredId}`);
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                const data = await response.json();

                setFeaturedProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct()

    }, [])

    const addItemToCart = () => {
        if (featuredProduct?._id) {
            console.log(`Adding product ${featuredProduct._id} to cart`);
            addProduct(featuredProduct._id);
            toast.success('Item added to cart')
        }
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center w-screen h-screen'>
                <Spinner />
            </div>
        );
    }


    if (featuredProduct) {
        return <>
            <div className="h-[1000px] md:h-[650px] w-screen flex flex-col md:flex-row relative overflow-hidden mt-10">
                <div className="md:py-40 w-full md:w-1/2 md:max-w-xl text-start px-5 md:pl-10">
                    <h1 className="text-3xl md:text-4xl max-md:mb-6 font-bold tracking-tight text-orange-500">
                        At <span className="text-gray-800">50%</span> Off
                    </h1>
                    <h1 className="text-4xl md:text-5xl max-md:mb-6 font-bold tracking-tight text-gray-900 my-3">
                        {featuredProduct.title}
                    </h1>
                    <p className="line-clamp-3 text-lg text-gray-500">
                        {featuredProduct.description}
                    </p>

                    <div className="flex items-center gap-4 max-sm:justify-center max-sm:mt-6 my-8">
                        <button
                            onClick={addItemToCart} className="inline-flex items-center justify-center gap-1.5 rounded border border-orange-500 bg-orange-500 px-5 py-3 text-white transition hover:border-orange-400 hover:bg-orange-400 focus:outline-none focus:ring"
                        >
                            Add to Cart
                        </button>
                        <button
                            className="inline-flex items-center justify-center gap-1.5 rounded border border-gray-800 bg-white px-5 py-3 text-black transition hover:border-gray-600 hover:text-gray-600 focus:outline-none focus:ring">
                            View Shop
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/2 md:grid md:grid-cols-2 p-4">

                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-12 my-5 md:my-0">
                        {featuredProduct?.images[0] && (
                            <div className="w-72 h-80 overflow-hidden rounded-lg border border-secondary transform rotate-3 translate-x-4 hover:-rotate-6 hover:translate-x-8 transition-transform duration-300 ease-in-out">
                                <Image src={featuredProduct.images[0].src} alt="hero-img" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                        {featuredProduct?.images[1] && (
                            <div className="w-72 h-80 overflow-hidden rounded-lg border border-secondary transform rotate-3 translate-x-4 hover:-rotate-6 hover:translate-x-8 transition-transform duration-300 ease-in-out">
                                <Image src={featuredProduct.images[1].src} alt="hero-img" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-12">
                        {featuredProduct?.images[2] && (
                            <div className="w-72 h-80 overflow-hidden rounded-lg border border-secondary transform rotate-3 translate-x-4 hover:-rotate-6 hover:translate-x-8 transition-transform duration-300 ease-in-out">
                                <Image src={featuredProduct.images[2].src} alt="hero-img" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                        {featuredProduct?.images[3] && (
                            <div className="w-72 h-80 overflow-hidden rounded-lg border border-secondary transform rotate-3 translate-x-4 hover:-rotate-6 hover:translate-x-8 transition-transform duration-300 ease-in-out">
                                <Image src={featuredProduct.images[3].src} alt="hero-img" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    }

    return null
}

/*
{ product }: HeroProps
*/