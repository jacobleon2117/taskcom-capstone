import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import * as AuthService from "../services/firebase/auth";

type UserRole = "admin" | "member" | "guest";

interface AppUser extends Omit<FirebaseUser, "displayName"> {
  role?: UserRole;
  organizationCode?: string;
  displayName?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    organizationName: string
  ) => Promise<string | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  joinOrganization: (organizationCode: string) => Promise<boolean>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional user details from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              ...firebaseUser,
              role: userData.role || "guest",
              organizationCode: userData.organizationCode,
              displayName: userData.displayName || firebaseUser.displayName,
            } as AppUser);
          } else {
            setUser(firebaseUser);
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.signInUser(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    organizationName: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.registerWithEmailAndPassword({
        email,
        password,
        displayName,
        organizationName,
      });
      return result.organizationCode;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logoutUser();
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.resetPassword(email);
    } catch (err: any) {
      setError(err.message || "Password reset failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinOrganization = async (organizationCode: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error("No user logged in");
      return await AuthService.joinOrganization(user.uid, organizationCode);
    } catch (err: any) {
      setError(err.message || "Failed to join organization");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        joinOrganization,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
