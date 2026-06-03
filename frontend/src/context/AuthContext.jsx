import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

const VITE_USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

// Initialize Firebase only if configured
let firebaseAuth = null;
if (VITE_USE_FIREBASE) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
    const app = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
    console.log("Firebase Auth Client SDK initialized successfully.");
  } catch (error) {
    console.error("Firebase SDK initialization failed, dropping back to Mock mode.", error.message);
  }
} else {
  console.log("Running frontend in LOCAL MOCK AUTH mode. No credentials required.");
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('crewflow_token') || null);

  // Synchronizes account details with Express backend
  const syncUserProfile = async (authToken) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const dbUser = await response.json();
        setUser(dbUser);
        localStorage.setItem('crewflow_token', authToken);
        setToken(authToken);
        return dbUser;
      } else {
        throw new Error('Database profile sync rejected.');
      }
    } catch (error) {
      console.error('Session synchronization failed:', error.message);
      logout();
    }
  };

  useEffect(() => {
    if (VITE_USE_FIREBASE && firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
        if (fbUser) {
          try {
            const idToken = await fbUser.getIdToken();
            await syncUserProfile(idToken);
          } catch (error) {
            console.error('Firebase state token retrieval failed:', error);
            logout();
          } finally {
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      });
      return unsubscribe;
    } else {
      const savedToken = localStorage.getItem('crewflow_token');
      if (savedToken) {
        syncUserProfile(savedToken).finally(() => setLoading(false));
      } else {
        setUser(null);
        setLoading(false);
      }
    }
  }, []);

  const signup = async (email, password, role = 'Member') => {
    setLoading(true);
    try {
      if (VITE_USE_FIREBASE && firebaseAuth) {
        const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const idToken = await credential.user.getIdToken();

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            firebaseUid: credential.user.uid,
            email,
            role,
            password
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to register profile in MongoDB');
        }

        const dbUser = await response.json();
        setUser(dbUser);
        setToken(idToken);
        localStorage.setItem('crewflow_token', idToken);
        setLoading(false);
        return dbUser;
      } else {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firebaseUid: `mock_uid_${email.replace(/[@.]/g, '_')}`,
            email,
            role,
            password
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Local mock registration failed');
        }

        return await login(email, password, role);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const login = async (email, password, role = 'Member') => {
    setLoading(true);
    try {
      if (VITE_USE_FIREBASE && firebaseAuth) {
        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const idToken = await credential.user.getIdToken();
        const profile = await syncUserProfile(idToken);
        setLoading(false);
        return profile;
      } else {
        const response = await fetch('/api/auth/mock-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, role })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Invalid login details');
        }

        const { token: mockToken, user: dbUser } = await response.json();
        setUser(dbUser);
        setToken(mockToken);
        localStorage.setItem('crewflow_token', mockToken);
        setLoading(false);
        return dbUser;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (VITE_USE_FIREBASE && firebaseAuth) {
        await firebaseSignOut(firebaseAuth);
      }
    } catch (error) {
      console.error('Sign-out exception:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('crewflow_token');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
