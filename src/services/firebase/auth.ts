import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { generateSixDigitCode } from "@/utils/codeGenerator";

interface UserRegistrationData {
  email: string;
  password: string;
  displayName: string;
  organizationName: string;
}

export const registerWithEmailAndPassword = async (
  userData: UserRegistrationData
): Promise<{ user: User; organizationCode: string | null }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    // Only create the basic user profile, without organization details
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: "pending", // Temporary role until they create/join an org
      createdAt: new Date(),
    });

    return { user, organizationCode: null };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const createOrganization = async (
  userId: string,
  organizationName: string
): Promise<string> => {
  try {
    const organizationCode = generateSixDigitCode();

    // Create the organization
    const organizationRef = doc(
      collection(db, "organizations"),
      organizationCode
    );
    await setDoc(organizationRef, {
      name: organizationName,
      createdBy: userId,
      createdAt: new Date(),
      code: organizationCode,
    });

    // Update the user with organization details
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        organizationCode: organizationCode,
        organizationName: organizationName,
        role: "admin",
      },
      { merge: true }
    );

    return organizationCode;
  } catch (error) {
    console.error("Organization creation error:", error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const validateOrganizationCode = async (code: string) => {
  try {
    const organizationRef = doc(db, "organizations", code);
    const organizationDoc = await getDoc(organizationRef);

    return organizationDoc.exists();
  } catch (error) {
    console.error("Organization code validation error:", error);
    return false;
  }
};

export const joinOrganization = async (
  userId: string,
  organizationCode: string
) => {
  try {
    const isValidCode = await validateOrganizationCode(organizationCode);
    if (!isValidCode) {
      throw new Error("Invalid organization code");
    }

    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        organizationCode,
        role: "member",
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Join organization error:", error);
    throw error;
  }
};
