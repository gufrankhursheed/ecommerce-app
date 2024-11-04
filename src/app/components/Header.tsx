"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { User } from "@auth/core/types";


export default function Header({ user }: { user?: User }) {
    const { cartProducts } = useCart();

    return <>
        <header className="bg-white border-b sticky z-50 top-0">
            <div className="mx-auto flex h-16 max-w-screen-3xl items-center gap-8 px-5 pl-3 sm:px-6 lg:px-8">
                <Link className="text-orange-500  hover:text-orange-400 flex md:flex md:items-center md:gap-1 text-xl" href="/">
                    <span className="sr-only">Home</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                    </svg>
                    / My Shop
                </Link>

                <div className=" flex flex-row md:flex md:flex-1 md:items-center md:justify-between">
                    <nav aria-label="Global" className="hidden md:block">
                        <ul className="flex items-center gap-6 text-xl">
                            <li>
                                <Link className="text-gray-500  transition hover:text-orange-500" href="/"> Home </Link>
                            </li>

                            <li>
                                <Link className="text-gray-500 transition hover:text-orange-500" href="/products"> Products </Link>
                            </li>

                        </ul>
                    </nav>

                    <div className="flex flex-row mx-3 md:mx-0">
                        {user ? (
                            <div className="sm:flex sm:gap-2 flex items-center border-r-2 border-orange-500 pr-4">
                                {user?.image &&
                                    <div className="h-9 w-9">
                                        <img src={user.image} alt="image" className="h-9 w-9 rounded-full object-cover object-center" />
                                    </div>
                                }
                            </div>
                        ) : (
                            <Link
                                className=" hidden sm:block px-5 py-2.5 text-sm font-medium border-r-2 border-orange-500  transition"
                                href="#"
                            >
                                Account
                            </Link>
                        )}

                        <div className="flex items-center mx-3">
                            <Link
                                className="group rounded-md px-2 py-2.5 text-md font-medium text-orange-500 transition hover:text-orange-400 sm:block"
                                href="/cart"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </Link>
                            <span className="text-orange-500 transition hover:text-orange-400 font-bold cursor-pointer">{cartProducts.length}</span>
                        </div>
                    </div>

                    <button
                        className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden"
                    >
                        <span className="sr-only">Toggle menu</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                </div>
            </div>
        </header>
    </>
}

