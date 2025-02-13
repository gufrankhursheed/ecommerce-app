"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface Currentuser {
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: Currentuser;
    setCurrentUser: (user: Currentuser) => void;
    fetchUser: () => Promise<void>;
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Fetch user function
    const fetchUser = async () => {
        try {
            const res = await fetch("/api/user", { credentials: "include" });

            if (!res.ok) {
                setCurrentUser(null);
                return;
            }

            const data = await res.json();
            console.log("User fetched:", data);

            setCurrentUser(data.user);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user: currentUser, setCurrentUser, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};