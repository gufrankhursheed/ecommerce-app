"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { handleSignIn } from "@/app/actions/signInAction";

const signup = () => {

    const router = useRouter();

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            })
            if (!res.ok) {
                throw new Error("Signup failed");
            }
            router.push("/login");
        } catch (error) {
            console.log("error during signup ", error)
        }
    };

    return (
        <div className='flex items-center justify-center h-screen mx-5 md:mx-0'>
            <div className="shadow-lg rounded-md p-14 w-96">
                <h1 className='text-xl text-orange-500 text-center font-bold'>Signup</h1>
                <form onSubmit={handleSubmit} className="flex flex-col my-3 gap-3">
                    <input onChange={(e) => setUsername(e.target.value)} type="text" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder='Name' />
                    <input onChange={(e) => setEmail(e.target.value)} type="text" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder='Email' />
                    <input onChange={(e) => setPassword(e.target.value)} type="password" className="block p-3 border w-full rounded-md border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder='Password' />
                    <button className="inline-flex items-center justify-center gap-1.5 rounded border border-orange-500 bg-orange-500 px-5 py-1 text-white transition hover:border-orange-400 hover:bg-orange-400 focus:outline-none focus:ring">signup</button>
                </form>
                <Link href={"/login"} className="my-2 text-gray-500">
                    Already have an account? <span className="text-orange-500 font-semibold">Login</span>
                </Link>
                <h2 className="text-center my-1">OR</h2>
                <button
                    onClick={handleSignIn}
                    className="inline-flex items-center justify-center w-full gap-1.5 rounded border border-orange-500 bg-orange-500 px-5 py-1 text-white transition hover:border-orange-400 hover:bg-orange-400 focus:outline-none focus:ring"
                >
                    Continue with Google
                </button>

            </div>
        </div>
    )
}

export default signup