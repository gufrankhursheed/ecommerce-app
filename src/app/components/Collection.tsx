"use client";

import { useEffect, useState } from "react";
import Spinner from "./Spinner";

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

interface HeroProps {
    product: Product | null;
}

export default function Collection() {
    const collectionId = "67247e695db9d3033222f83b";

    const [collectionProduct, setCollectionProduct] = useState<Product>()
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {    
        const fetchCollection = async () => {
          try {
            const response = await fetch(`/api/products/${collectionId}`);
            if (!response.ok) {
              throw new Error("Product not found");
            }
            const data = await response.json();
    
            setCollectionProduct(data);
          } catch (error) {
            console.error("Error fetching product:", error);
          } finally {
            setLoading(false);
          }
        }
        fetchCollection()
      }, [])
    
      if (loading) {
        return (
          <div className='flex items-center justify-center w-screen h-screen'>
            <Spinner />
          </div>
        );
      }

    if (collectionProduct) {
        return <>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-20 mx-auto">
                    <div className="text-center my-3 px-5 md:px-20 lg:px-96">
                        <h1 className="text-3xl font-bold tracking-tighter text-gray-900 my-2">New Collection</h1>
                        <p className="text-center line-clamp-3 text-lg text-gray-500 my-2">
                            Explore our latest arrivals and elevate your style with our exclusive new collection
                        </p>
                    </div>

                    <div className="flex flex-wrap -m-4 my-7">
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4 px-3 md:px-24 rounded-md">
                            <div className="h-full my-16 md:text-center lg:text-start">
                                <h1 className="text-3xl font-bold tracking-tighter text-gray-900 my-2 ">{collectionProduct.title}</h1>
                                <p className="leading-relaxed my-2 ">{collectionProduct.description}</p>
                                <p className="text-orange-500 my-3">
                                    Rs: {collectionProduct.price}
                                </p>
                                <button
                                    className="inline-flex items-center justify-center gap-1.5 rounded border border-gray-800 bg-white my-2 px-5 py-3 text-black transition hover:border-gray-600 hover:text-gray-600 focus:outline-none focus:ring">
                                    View All
                                </button>
                            </div>
                        </div>
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4 md:px-40 lg:px-0">
                            <div className="h-full flex items-center mx-14 md:mx-20">
                                <img src={collectionProduct.images[0].src} alt="image" className="h-72" />
                            </div>
                        </div>
                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4 md:px-40 lg:px-0">
                            <div className="h-full flex items-center mx-14 md:mx-20">
                                <img src={collectionProduct.images[1].src} alt="image" className="h-72" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    }

    return null
}

/*
{ product }: HeroProps
*/