"use client";

import Spinner from "@/app/components/Spinner";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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


export default function Product() {
    const { id } = useParams();

    const [productInfo, setProductInfo] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const { addProduct } = useCart();

    useEffect(() => {
        if (!id) {
            setLoading(false)
            return;
        } else {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`/api/products/${id}`);
                    if (!response.ok) {
                        throw new Error("Product not found");
                    }
                    const data = await response.json();

                    setProductInfo(data);
                } catch (error) {
                    console.error("Error fetching product:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }

    }, [id]);

    if (loading) {
        return (
            <div className='flex items-center justify-center w-screen h-screen'>
                <Spinner />
            </div>
        );
    }

    if (!productInfo) {
        return <div>No product information available.</div>;
    }

    return <>
        <section className="mt-20 md:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:rounded-lg overflow-hidden px-4 py-2 md:px-2">
                    <Image
                        src={productInfo.images[0].src}
                        alt="product-image"
                        className={productInfo.title === "Nike Air Force" ? "w-full h-full md:h-[90vh] object-contain object-center border rounded-lg bg-gray-100" : "w-full h-full object-contain object-center border rounded-lg"}
                    />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-1 lg:gap-y-4 px-2 py-2 gap-2 md:gap-2">
                    {productInfo.images.slice(1, 3).map((image, index) => (
                        <div className="lg:aspect-h-2 lg:aspect-w-3 lg:rounded-lg overflow-hidden" key={index}>
                            <Image src={image.src} alt="product-image" className={productInfo.title === "Nike Air Force" ? "w-full h-full md:h-[44vh] object-cover object-center border border-secondary rounded-lg" : "w-full h-full md:h-[44vh] object-contain object-center border border-secondary rounded-lg"} />
                        </div>
                    ))}
                </div>

                <div className="p-4 lg:p-8 border lg:rounded-lg my-2">
                    <h1 className="text-3xl font-semibold text-text">
                        {productInfo.title}
                    </h1>
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">
                            Description
                        </h2>
                        <p className="mt-2 text-gray-700">
                            {productInfo.description}
                        </p>
                    </div>

                    <div className="relative flex items-center justify-between my-8">
                        <Link href={`/products/${productInfo._id}`}>
                            <div className=" my-2 flex items-center justify-between ">
                                <p className="text-orange-500 text-lg">
                                   Price: Rs {productInfo.price}
                                </p>
                            </div>
                        </Link>
                        <button type="button" onClick={() => { addProduct(productInfo._id); toast.success('Item added to cart') }} className="inline-flex mr-2 md:mr-8 items-center gap-1.5 rounded-lg border my-1 md:my-0 md:ml-56 lg:mx-0 px-2 py-2.5  border-orange-500 bg-orange-500 text-white transition hover:border-orange-400 hover:bg-orange-400 text-center text-sm font-medium shadow-sm focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400">
                            Add to Cart
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>

                        </button>
                    </div>
                </div>
            </div>

        </section>
    </>
}

/*
lg:aspect-h-2 lg:aspect-w-2 lg:rounded-lg overflow-hidden
 md:h-[90vh] object-cover object-center

 "w-full h-full object-contain object-center border rounded-lg bg-gray-100"
*/
