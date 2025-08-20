import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";

type AuthCtx = {
    user: User | null;
    initializing: boolean;
    signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setInitializing(false);
        });
        return () => unsub();
    }, []);

    const signOut = async () => {
        await auth.signOut();
    };

    return <Ctx.Provider value={{ user, initializing, signOut }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
    const authContextValue = useContext(Ctx);
    if (!authContextValue) throw new Error("useAuth must be used within AuthProvider");
    return authContextValue;
};