"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
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


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { addProduct } = useCart();

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await fetch("/api/products")
                const data: Product[] = await res.json()
                setProducts(data)
            } catch (error) {
                console.log("find all products error", error)
            } finally {
                setLoading(false);
            }
        }
        getProducts()
    }, [])

    if (loading) {
        return (
            <div className='flex items-center justify-center w-screen h-screen'>
                <Spinner />
            </div>
        );
    }

    return <>
        <div className="flex justify-center min-h-screen w-full my-5">
            <div className="grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8 px-2">
                {products?.length > 0 && products.map((product) => (
                    <div key={product._id}>
                        <div className="group block overflow-hidden border rounded-xl border-opacity-10">
                            <Link href={`/products/${product._id}`}>
                                <div className="relative md:h-[300px] h-[200px]">
                                    <Image src={product.images[0].src} alt="image" className="absolute inset-0 h-full w-full object-contain opacity-100 group-hover:opacity-0" />
                                    <Image src={product.images[1].src} alt="image" className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100" />
                                </div>
                                <div className="relative px-3 md:p-3 border-t">
                                    <h3 className="text-md text-gray-900 group-hover:underline line-clamp-2 truncate">{product.title}</h3>
                                </div>
                            </Link>
                            <div className="relative md:flex md:items-center lg:justify-between px-3 md:p-2">
                                <Link href={`/products/${product._id}`}>
                                    <div className=" my-2 flex items-center md:mx-1 justify-between text-gray-700">
                                        <p className="text-orange-500">
                                            Rs: {product.price}
                                        </p>
                                    </div>
                                </Link>
                                <button type="button" onClick={() => { addProduct(product._id); toast.success('Item added to cart') }} className="inline-flex items-center gap-1.5 rounded-lg border my-1 md:my-0 md:ml-56 lg:mx-0 px-2 py-2.5  border-orange-500 bg-orange-500 text-white transition hover:border-orange-400 hover:bg-orange-400 text-center text-sm font-medium shadow-sm focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400">
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
        </div >
    </>
}