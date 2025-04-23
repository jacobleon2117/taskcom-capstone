import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import {
  signInUser,
  registerWithEmailAndPassword,
  logoutUser,
  resetPassword as resetPasswordService,
  joinOrganization,
  createOrganization as createOrganizationService,
} from "@/services/firebase/auth";

export type UserRole = "admin" | "member" | "pending";

export interface UserData {
  email: string;
  displayName: string;
  role: UserRole;
  organizationCode?: string;
  organizationName?: string;
  createdAt: Date;
}

// This is what we return from the context
export interface UserWithData {
  uid: string;
  email: string | null;
  displayName: string;
  role: UserRole;
  organizationCode?: string;
  organizationName?: string;
}

interface AuthContextType {
  user: UserWithData | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<FirebaseUser>;
  createOrganization: (organizationName: string) => Promise<string>;
  joinOrg: (organizationCode: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<UserWithData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setCurrentUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userDataFromFirestore = userDoc.data() as UserData;
            setUserData(userDataFromFirestore);

            // Combine Firebase user and Firestore data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userDataFromFirestore.displayName,
              role: userDataFromFirestore.role,
              organizationCode: userDataFromFirestore.organizationCode,
              organizationName: userDataFromFirestore.organizationName,
            });
          } else {
            // User document doesn't exist in Firestore
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUser(null);
        }
      } else {
        setUserData(null);
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const user = await signInUser(email, password);
      return user;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to login";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // We'll handle organization creation separately
      const { user } = await registerWithEmailAndPassword({
        email,
        password,
        displayName,
        organizationName: "", // This will be updated later
      });

      // Important: we don't fully update the user state here
      // This allows navigation to CreateOrganization screen

      return user;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to register";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update the createOrganization function
  const createOrganization = async (
    organizationName: string
  ): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      if (!currentUser) {
        throw new Error("User must be logged in to create an organization");
      }

      // Use the renamed service function
      const organizationCode = await createOrganizationService(
        currentUser.uid,
        organizationName
      );

      // Refresh user data
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const updatedUserData = userDoc.data() as UserData;
        setUserData(updatedUserData);

        // Update the combined user object
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: updatedUserData.displayName,
          role: updatedUserData.role,
          organizationCode: updatedUserData.organizationCode,
          organizationName: updatedUserData.organizationName,
        });
      }

      return organizationCode;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create organization";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinOrg = async (organizationCode: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!currentUser) {
        throw new Error("User must be logged in to join an organization");
      }

      const result = await joinOrganization(currentUser.uid, organizationCode);

      // Refresh user data
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const updatedUserData = userDoc.data() as UserData;
        setUserData(updatedUserData);

        // Update the combined user object
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: updatedUserData.displayName,
          role: updatedUserData.role,
          organizationCode: updatedUserData.organizationCode,
          organizationName: updatedUserData.organizationName,
        });
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to join organization";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logoutUser();
      // Firebase auth state change will trigger the useEffect to update user state
    } catch (err: any) {
      const errorMessage = err.message || "Failed to logout";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      await resetPasswordService(email);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reset password";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    setError,
    login,
    register,
    createOrganization,
    joinOrg,
    logout,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
