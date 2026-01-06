"use client";

import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION } from '../../lib/graphql/mutations';
import { useAuth, User } from '../../context/AuthContext';

interface LoginMutationData {
    login: {
        accessToken: string;
        user: User;
    };
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { login } = useAuth();

    const [loginMutation, { loading }] = useMutation<LoginMutationData>(LOGIN_MUTATION, {
        onCompleted: (data) => {
            login(data.login.accessToken, data.login.user);
        },
        onError: (err) => {
            setErrorMsg(err.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation({ variables: { loginInput: { email, password } } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="flex justify-center mb-6">
                    <img src="/FFFFFF-1.png" alt="Slooze" className="h-20" />
                </div>
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
                {errorMsg && <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            /* Added text-black here */
                            className="mt-1 block w-full border rounded p-2 text-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nick.fury@slooze.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            /* Added text-black here */
                            className="mt-1 block w-full border rounded p-2 text-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password123"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-8 space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Quick Login</p>
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { label: 'Nick Fury - Admin', email: 'nick.fury@slooze.com' },
                            { label: 'Capt. Marvel - Manager (IN)', email: 'captain.marvel@slooze.com' },
                            { label: 'Capt. America - Manager (USA)', email: 'captain.america@slooze.com' },
                            { label: 'Thanos - Member (IN)', email: 'thanos@slooze.com' },
                            { label: 'Thor - Member (IN)', email: 'thor@slooze.com' },
                            { label: 'Travis - Member (USA)', email: 'travis@slooze.com' },
                        ].map((user) => (
                            <button
                                key={user.email}
                                type="button"
                                onClick={() => {
                                    setEmail(user.email);
                                    setPassword('password123');
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-white hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 hover:shadow-sm rounded-lg transition-all flex items-center justify-between group"
                            >
                                <span>{user.label}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 font-bold">Fill</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}