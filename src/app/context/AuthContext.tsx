"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface Currentuser {
    _id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    currentUser: Currentuser;
    setCurrentUser: (user: Currentuser) => void;
    fetchUser: () => Promise<void>;
    refreshToken: () => Promise<void>;
    logout: () => void;
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any>(null);

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/user", {
                method: "GET",
                credentials: "include", 
            });

            if (!res.ok) {
                setCurrentUser(null);
                return;
            }

            const data = await res.json();

            setCurrentUser(data.user);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const refreshToken = async () => {
        try {
            const res = await fetch("/api/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: currentUser?.email }),
            });

            if (res.ok) {
                console.log("Access token refreshed successfully.");
                await fetchUser();
            } else {
                console.error("Refresh token failed, logging out...");
                logout();
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            logout();
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });

            setCurrentUser(null);
            window.location.href = "/login";
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            refreshToken();
        }, 14 * 60 * 1000); // 14 minutes

        return () => clearInterval(interval);
    }, [currentUser]);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, fetchUser, refreshToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};