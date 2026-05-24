import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, isConfigured } from '@/lib/firebase';
import { saveUserData, loadUserData } from './dataService';
import type { User } from '@/types';
import { generateId } from '@/lib/utils';

function mapFirebaseUser(fbUser: FirebaseUser): User {
  return {
    id: fbUser.uid,
    email: fbUser.email || '',
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
    businessName: '',
    avatar: fbUser.photoURL || '',
  };
}

// ===== Firebase Auth =====
async function firebaseLogin(email: string, password: string): Promise<User> {
  await setPersistence(auth, browserLocalPersistence);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = mapFirebaseUser(cred.user);
  await saveUserData(user.id, user);
  return user;
}

async function firebaseSignUp(email: string, password: string, name: string): Promise<User> {
  await setPersistence(auth, browserLocalPersistence);
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  const user: User = {
    ...mapFirebaseUser(cred.user),
    name,
  };
  await saveUserData(user.id, user);
  return user;
}

async function firebaseGoogleLogin(): Promise<User> {
  const provider = new GoogleAuthProvider();
  // Ensure auth state persists across page refreshes
  await setPersistence(auth, browserLocalPersistence);
  const cred = await signInWithPopup(auth, provider);
  const user = mapFirebaseUser(cred.user);
  await saveUserData(user.id, user);
  return user;
}

async function firebaseLogout(): Promise<void> {
  await firebaseSignOut(auth);
}

async function firebaseResetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// ===== Local Auth (fallback) =====
async function localLogin(email: string, _password: string): Promise<User> {
  const stored = localStorage.getItem('taptopmenu_user');
  if (stored) {
    const user = JSON.parse(stored) as User;
    if (user.email === email) return user;
  }
  // Demo: allow any credential
  const user: User = {
    id: generateId(),
    email,
    name: email.split('@')[0],
    businessName: '',
    avatar: '',
  };
  return user;
}

async function localSignUp(email: string, _password: string, name: string): Promise<User> {
  const user: User = {
    id: generateId(),
    email,
    name: name || email.split('@')[0],
    businessName: '',
    avatar: '',
  };
  return user;
}

async function localGoogleLogin(): Promise<User> {
  const user: User = {
    id: generateId(),
    email: 'demo@gmail.com',
    name: 'Demo User',
    businessName: '',
    avatar: '',
  };
  return user;
}

async function localLogout(): Promise<void> {
  localStorage.removeItem('taptopmenu_user');
}

async function localResetPassword(_email: string): Promise<void> {
  // No-op in demo mode
}

// ===== Exported unified API =====
export const authService = {
  login: isConfigured ? firebaseLogin : localLogin,
  signUp: isConfigured ? firebaseSignUp : localSignUp,
  googleLogin: isConfigured ? firebaseGoogleLogin : localGoogleLogin,
  logout: isConfigured ? firebaseLogout : localLogout,
  resetPassword: isConfigured ? firebaseResetPassword : localResetPassword,

  // For listening to auth state changes (Firebase only)
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    if (isConfigured) {
      return onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          callback(mapFirebaseUser(fbUser));
        } else {
          callback(null);
        }
      });
    }
    // No-op for local mode
    callback(null);
    return () => {};
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (isConfigured) {
      const fbUser = auth.currentUser;
      if (fbUser) {
        const userData = await loadUserData(fbUser.uid);
        return userData || mapFirebaseUser(fbUser);
      }
      return null;
    }
    const stored = localStorage.getItem('taptopmenu_user');
    return stored ? JSON.parse(stored) : null;
  },
};

export { isConfigured as isAuthConfigured };
