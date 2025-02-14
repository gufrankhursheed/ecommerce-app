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
    isTokenExpired: boolean;
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isTokenExpired, setIsTokenExpired] = useState(false);

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/user", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setIsTokenExpired(true);
                }
                setCurrentUser(null);
                return;
            }

            const data = await res.json();

            setCurrentUser(data.user);
            setIsTokenExpired(false);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const refreshToken = async () => {
        try {
            const res = await fetch("/api/user/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: currentUser?.email }),
            });
    
            const data = await res.json();
            console.log("Refresh Token Response:", data); // Debugging response
    
            if (res.ok) {
                console.log("Access token refreshed successfully.");
                setIsTokenExpired(false);
                fetchUser();  // Fetch updated user data
            } else {
                console.error("Refresh token failed:", data.message);
                setIsTokenExpired(true);
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            setIsTokenExpired(true);
        }
    }

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
        if (!isTokenExpired) {
            const interval = setInterval(() => {
                refreshToken();
            }, 14 * 60 * 1000); 

            return () => clearInterval(interval);
        }
    }, [currentUser, isTokenExpired]);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, fetchUser, refreshToken, logout, isTokenExpired }}>
            {children}
        </AuthContext.Provider>
    );
};