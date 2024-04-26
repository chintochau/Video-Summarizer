// src/services/AuthService.js
import { auth } from '../config/firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,getAuth, signInWithPopup,
} from "firebase/auth";

class AuthService {
  static async checkAuth() {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      }, (error) => {
        unsubscribe();
        reject(error);
      });
    });
  }
  // Register a new user
  static async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Sign in a user
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Log out the current user
  static async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Send a password reset email
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Subscribe to authentication state changes
  static onAuthChange(onAuthStateChangedCallback) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        onAuthStateChangedCallback(user);
      } else {
        // User is signed out
        onAuthStateChangedCallback(null);
      }
    });
  }

  static async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default AuthService;
