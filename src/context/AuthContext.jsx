import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Hook to access the context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for an existing session
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Mock login logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const fakeUser = {
                        uid: 'user-12345',
                        email: email,
                        displayName: email.split('@')[0],
                        photoURL: '',
                        role: 'owner'
                    };
                    localStorage.setItem('mockUser', JSON.stringify(fakeUser));
                    setUser(fakeUser);
                    resolve(fakeUser);
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 500); // Simulate network delay
        });
    };

    const loginWithGoogle = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeUser = {
                    uid: 'google-user-12345',
                    email: 'demo@gmail.com',
                    displayName: 'Demo User',
                    photoURL: '',
                    role: 'owner'
                };
                localStorage.setItem('mockUser', JSON.stringify(fakeUser));
                setUser(fakeUser);
                resolve(fakeUser);
            }, 500);
        });
    };

    const logout = async () => {
        localStorage.removeItem('mockUser');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        loginWithGoogle,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
