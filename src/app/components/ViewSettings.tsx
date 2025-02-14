"use client";

import { useAuth } from "../context/AuthContext";
import { User } from "@auth/core/types";

export default function ViewSettings({ user }: { user?: User }) {
    const { currentUser, isTokenExpired, refreshToken } = useAuth();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/user/logout", {
                method: "POST",
                credentials: "include",
            });
    
            if (res.ok) {
                window.location.href = "/login"; 
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error logging out", error);
        }
    }

    if (isTokenExpired) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 mb-4">Your session has expired. Please refresh your token.</p>
                <button
                    onClick={refreshToken}
                    className="px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                    Refresh Token
                </button>
            </div>
        );
    }

    return user || currentUser ? (
        <header className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 py-5 sm:px-6 sm:py-10 lg:px-8">
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="sm:flex sm:gap-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="2em"
                                    height="2em"
                                    className="rounded border border-orange-500 bg-orange-500 text-white transition hover:border-orange-400 hover:bg-orange-400 focus:outline-none focus:ring"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M6.196 17.485q1.275-.918 2.706-1.451Q10.332 15.5 12 15.5t3.098.534t2.706 1.45q.99-1.025 1.593-2.42Q20 13.667 20 12q0-3.325-2.337-5.663T12 4T6.337 6.338T4 12q0 1.667.603 3.064q.603 1.396 1.593 2.42M12 12.5q-1.263 0-2.132-.868T9 9.5t.868-2.132T12 6.5t2.132.868T15 9.5t-.868 2.132T12 12.5m0 8.5q-1.883 0-3.525-.701t-2.858-1.916t-1.916-2.858T3 12t.701-3.525t1.916-2.858q1.216-1.215 2.858-1.916T12 3t3.525.701t2.858 1.916t1.916 2.858T21 12t-.701 3.525t-1.916 2.858q-1.216 1.215-2.858 1.916T12 21"
                                    ></path>
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{user ? user.name : currentUser.username }</h1>
                        </div>
                        <p className="mt-1.5 text-md text-gray-500">
                            {user ? user.email : currentUser.email}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center gap-1.5 rounded border border-red-200 bg-white px-5 py-3 text-red-900 transition hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring"
                        >
                            <span className="text-sm font-medium"> Log out </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    ) : (
        <div>no user</div>
    )
}