"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useRouter } from "next/navigation";
import { useQuery, useApolloClient } from "@apollo/client/react";
import { ME_QUERY } from "../lib/graphql/queries";

// Use backend-compatible enums
export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    MEMBER = 'MEMBER',
}

export enum Country {
    INDIA = 'INDIA',
    USA = 'USA',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    country: Country;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
}

interface MeQueryData {
    me: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const client = useApolloClient();
    const initialized = useRef(false);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        client.resetStore();
        router.push('/login');
    }, [client, router]);

    // Me Query to fetch user if token exists
    const { data: meData, error: meError } = useQuery<MeQueryData>(ME_QUERY, {
        skip: !token,
    });

    // Handle query result changes
    useEffect(() => {
        if (meData?.me) {
            // Use functional update to avoid lint warning
            queueMicrotask(() => {
                setUser(meData.me);
                setLoading(false);
            });
        } else if (meError) {
            queueMicrotask(() => {
                logout();
                setLoading(false);
            });
        }
    }, [meData, meError, logout]);

    // Initialize from localStorage
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            queueMicrotask(() => setToken(storedToken));
        } else {
            queueMicrotask(() => setLoading(false));
        }
    }, []);

    const login = useCallback((newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
        router.push('/');
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
