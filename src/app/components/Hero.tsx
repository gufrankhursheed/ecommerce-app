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
    stock: number
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
                        {featuredProduct.stock === 0 ? (
                            <span className=" items-center gap-2 rounded-lg border my-1 md:my-0 md:ml-56 lg:mx-1 px-3 py-2.5 text-white transition border-orange-400 bg-orange-400 text-center text-md font-medium shadow-sm focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400">
                                Out of Stock
                            </span>
                        ) : (
                            <button type="button" onClick={() => { addProduct(featuredProduct._id); toast.success('Item added to cart') }} className="inline-flex items-center justify-center gap-1.5 rounded border border-orange-500 bg-orange-500 px-5 py-3 text-white transition hover:border-orange-400 hover:bg-orange-400 focus:outline-none focus:ring">
                                Add to Cart
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>

                            </button>
                        )}
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
                                <Image src={featuredProduct.images[0].src} height={1000} width={10000} alt="hero-img" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                        {featuredProduct?.images[1] && (
                            <div className="w-72 h-80 overflow-hidden rounded-lg border border-secondary transform rotate-3 translate-x-4 hover:-rotate-6 hover:translate-x-8 transition-transform duration-300 ease-in-out">
                                <Image src={featuredProduct.images[1].src} height={1000} width={1000} alt="hero-img" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-12">
                        {featuredProduct?.images[2] && (
                            <div className="w-72 h-80 overflow-hidden rounded-lg border border-secondary transform rotate-3 translate-x-4 hover:-rotate-6 hover:translate-x-8 transition-transform duration-300 ease-in-out">
                                <Image src={featuredProduct.images[2].src} height={1000} width={1000} alt="hero-img" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                        {featuredProduct?.images[3] && (
                            <div className="w-72 h-80 overflow-hidden rounded-lg border border-secondary transform rotate-3 translate-x-4 hover:-rotate-6 hover:translate-x-8 transition-transform duration-300 ease-in-out">
                                <Image src={featuredProduct.images[3].src} height={1000} width={1000} alt="hero-img" className="h-full w-full object-cover object-center" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    }

    return null
}
