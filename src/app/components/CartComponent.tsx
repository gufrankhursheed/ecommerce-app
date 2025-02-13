"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import Link from "next/link";
import Spinner from "./Spinner";
import { User } from "@auth/core/types";
import { handleSignIn } from "@/app/actions/signInAction";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Success from "./Success";
import { useAuth } from "../context/AuthContext";

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

export default function CartComponent({ user }: { user?: User }) {

    const { cartProducts, addProduct, removeProduct, clearCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zip, setZip] = useState('');
    const searchParams = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        const successParam = searchParams?.get("success");
        if (successParam === "true") {
            console.log("Order was successful");
            setIsSuccess(true);
        } else {
            console.log("No success parameter found");
        }
    }, [searchParams]);


    useEffect(() => {
        if (cartProducts.length > 0) {
            fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: cartProducts }),
            })
                .then(response => response.json())
                .then(data => {
                    setProducts(data);
                })
                .catch(error => {
                    console.error("Error fetching products:", error);
                })
                .finally(() => {
                    setLoading(false);
                })
        } else {
            console.log("Cart is empty");
            setProducts([]);
        }
    }, [cartProducts])

    useEffect(() => {
        if (isSuccess) {
            clearCart();
            toast.success("Order successfully placed");
        }
    }, [isSuccess]);

    const increaseProduct = (id: string) => {
        addProduct(id)
        toast.success('Item added to cart')
    }

    const decreaseProduct = (id: string) => {
        removeProduct(id)
        toast.success('Item removed from cart')
    }

    const emptyCart = () => {
        clearCart();
        toast.success('Cart Cleared')
    }

    let total = 0;

    for (const productId of cartProducts) {
        const product = products.find((p: Product) => p._id === productId);
        const price = product ? product.price : 0;
        total += price;
    }

    const stripeFunction = async () => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user?.email,
                    name: user?.name,
                    address: address,
                    city: city,
                    state: state,
                    zip: zip,
                    cartProducts: cartProducts
                })
            })

            if (response.ok) {
                const result = await response.json();
                window.location.href = result.url;
            } else {
                const result = await response.json();
                console.error("Checkout failed:", result.message);
            }
        } catch (error) {
            console.error("An error occurred during checkout:", error);
            toast.error("An error occured");
        }
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center w-screen h-screen'>
                <Spinner />
            </div>
        );
    }

    if (isSuccess) {
        return <Success />;
    }


    return (
        <section className="flex justify-between max-md:flex-col space-x-4">
            <div className="md:w-2/3 px-8">
                <div className="mt-16 md:mt-6">
                    <header className="text-center flex justify-between w-full">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                            Your Cart
                        </h1>
                    </header>

                    {!products?.length ? (
                        <p className="my-6 text-center">Your Cart Is Empty</p>
                    ) : (
                        <div className="mt-8">
                            <ul className="space-y-4">
                                {products?.length > 0 &&
                                    products.map((product) => (
                                        <li key={product._id} className="flex items-center gap-4 justify-between">
                                            <Image src={product.images[0].src} alt="images" width={200} height={250} className="w-24 h-20 object-cover" />
                                            <div >
                                                <h3 className="md:text-lg  text-gray-900 ">{product.title}</h3>
                                                <dl className="mt-1 space-y-px md:text-md text-gray-900">
                                                    <p>Rs {cartProducts.filter(id => id === product._id).length * product.price} </p>
                                                </dl>
                                            </div>

                                            <div>
                                                <label htmlFor="Quantity" className="sr-only">Quantity</label>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => decreaseProduct(product._id)}
                                                        type="button"
                                                        className="h-10 w-10 leading-10 text-gray-60 transition hover:opacity-75 border"
                                                    >
                                                        -
                                                    </button>

                                                    <input
                                                        id="Quantity"
                                                        value={cartProducts.filter(id => id === product._id).length}
                                                        onChange={() => { }}
                                                        className="h-10 w-16 md:pl-1 rounded border text-orange-500 text-lg font-bold border-gray-200 text-center"
                                                    />

                                                    <button
                                                        onClick={() => increaseProduct(product._id)}
                                                        type="button"
                                                        className="h-10 w-10 leading-10 text-gray-60 transition hover:opacity-75 border"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    <div className=" my-5 flex justify-end border-t border-gray-100 pt-8">
                        <div className="max-w-md space-y-4">
                            <dl className="space-y-1 text-md text-text">
                                <div className="flex justify-end text-red-500 border-b mb-3">
                                    <button onClick={emptyCart}>Clear Cart</button>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <dt>Total</dt>
                                    <dd>Rs {total}</dd>
                                </div>
                            </dl>
                            <div className="flex justify-end">
                                <Link
                                    className="group flex items-center justify-between gap-4 rounded-lg border border-orange-500 bg-orange-500 px-5 py-3 transition-colors hover:bg-transparent focus:outline-none focus:ring"
                                    href="/products"
                                >
                                    <span
                                        className="font-medium text-white transition-colors group-hover:text-orange-400 group-active:text-orange-5400"
                                    >
                                        Continue Shopping
                                    </span>

                                    <span
                                        className="shrink-0 rounded-full border border-current bg-white p-2 text-orange-500 group-active:text-orange-500"
                                    >
                                        <svg
                                            className="size-5 rtl:rotate-180"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            />
                                        </svg>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!products?.length ? (
                ''
            ) : (
                <div className="md:1/3 mt-16 md:mt-6 ">
                    {user || currentUser ? (
                        <div>
                            <header className="text-start flex flex-col w-full">
                                <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                    Shipping Details
                                </h1>
                                <p className="mt-2">We use your Account details for shipping.</p>
                            </header>

                            <div className="max-w-xl p-4 border shadow-xl h-[400px] my-3 mx-2 rounded-md ">
                                <div className="space-y-5">
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-6">
                                            <label htmlFor="example7" className="mb-1 block text-md font-medium text-gray-700">Email</label>
                                            <input type="email" value={user?.email ?? currentUser.email ?? ""} onChange={() => { }} id="example7" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="you@email.com" />
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="example8" className="mb-1 block text-md font-medium text-gray-700">Full name</label>
                                            <input type="text" value={user?.name ?? currentUser.username ?? ""} onChange={() => { }} id="example8" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="John Mark" />
                                        </div>
                                        <div className="col-span-12">
                                            <label htmlFor="example9" className="mb-1 block text-md font-medium text-gray-700">Address</label>
                                            <input type="text" id="example9" value={address} onChange={(e) => setAddress(e.target.value)} className="block p-3 border w-full rounded-md border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="1864 Main Street" />
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="example10" className="mb-1 block text-md font-medium text-gray-700">City</label>
                                            <input type="text" id="example10" value={city} onChange={(e) => setCity(e.target.value)} className="block p-3 border w-full rounded-md border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="" />
                                        </div>
                                        <div className="col-span-4">
                                            <label htmlFor="example11" className="mb-1 block text-md font-medium text-gray-700">State</label>
                                            <input type="text" id="example10" value={state} onChange={(e) => setState(e.target.value)} className="block p-3 border w-full rounded-md border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="" />
                                        </div>
                                        <div className="col-span-2">
                                            <label htmlFor="example12" className="mb-1 block text-md font-medium text-gray-700">Zip</label>
                                            <input type="text" id="example12" value={zip} onChange={(e) => setZip(e.target.value)} className="block p-3 border w-full rounded-md border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="" />
                                        </div>
                                        <div className="col-span-12 text-center w-full">
                                            <button type="button" onClick={stripeFunction} className="rounded-lg border w-full px-5 py-2.5 text-center text-white border-orange-500 bg-orange-500 hover:bg-orange-400 text-md font-medium shadow-sm transition-all disabled:cursor-not-allowed">Checkout</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <header className="text-start flex flex-col w-full">
                                <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                                    You should sign up for shipping details
                                </h1>
                                <p className="mt-2">We use your Account details for shipping.</p>
                            </header>

                            <form action={handleSignIn}>
                                <button className="inline-flex items-center justify-center gap-1.5 rounded border border-orange-500 bg-orange-500 px-5 py-3 text-white transition hover:border-orange-400 hover:bg-orange-400 focus:outline-none focus:ring" type="submit"> Continue with Google </button>
                            </form>
                        </div>
                    )}
                </div>
            )}

        </section>
    );
}