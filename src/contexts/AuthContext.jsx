import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function with email verification
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      return { 
        success: true, 
        user: userCredential.user,
        message: 'Verification email sent! Please check your inbox.'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login function with email verification check
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        return { 
          success: false, 
          error: 'Please verify your email before logging in. Check your inbox for the verification link.'
        };
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Password reset function
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true, 
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Social login function
  const socialLogin = async (providerType) => {
    try {
      let provider;
      if (providerType === 'google') {
        provider = new GoogleAuthProvider();
      } else if (providerType === 'github') {
        provider = new GithubAuthProvider();
      } else {
        throw new Error('Unsupported provider');
      }
      
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Set up auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    socialLogin,
    sendEmailVerification: async () => {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true, message: 'Verification email sent!' };
      }
      return { success: false, error: 'No user is currently logged in.' };
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
