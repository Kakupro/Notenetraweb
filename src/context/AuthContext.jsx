import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                let role = 'user';
                // Try to fetch extended profile/role from Firestore
                try {
                    const docRef = doc(db, 'users', firebaseUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        role = docSnap.data().role || 'user';
                    } else {
                        // Create basic user doc if it doesn't exist
                        await setDoc(docRef, {
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                            role: 'user',
                            createdAt: new Date()
                        });
                    }
                } catch (e) {
                    console.error("Error fetching user profile:", e);
                    // Fallback for configured admin if DB fails
                    if (firebaseUser.email === 'killnoymous@gmail.com') {
                        role = 'admin';
                    }
                }

                setUser({ ...firebaseUser, role });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email, password, additionalData) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Create user document in Firestore with additional data
        if (result.user) {
            await setDoc(doc(db, 'users', result.user.uid), {
                email: email,
                role: 'user',
                createdAt: new Date(),
                ...additionalData
            });
        }
        return result;
    };

    const loginWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
