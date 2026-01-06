"use client";

import { ApolloProvider } from "@apollo/client/react";
import createApolloClient from "../lib/apollo-client";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import React, { useMemo } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const client = useMemo(() => createApolloClient(), []);

    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <CartProvider>{children}</CartProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}
