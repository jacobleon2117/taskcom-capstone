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
import { auth, db } from "../../config/firebase";
import { generateSixDigitCode } from "../../utils/codeGenerator";

interface UserRegistrationData {
  email: string;
  password: string;
  displayName: string;
  organizationName: string;
}

export const registerWithEmailAndPassword = async (
  userData: UserRegistrationData
) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    // Generate organization code
    const organizationCode = generateSixDigitCode();

    // Create organization document
    const organizationRef = doc(
      collection(db, "organizations"),
      organizationCode
    );
    await setDoc(organizationRef, {
      name: userData.organizationName,
      createdBy: user.uid,
      createdAt: new Date(),
      code: organizationCode,
    });

    // Create user document in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: userData.email,
      displayName: userData.displayName,
      organizationCode: organizationCode,
      role: "admin", // First user is always admin
      createdAt: new Date(),
    });

    return { user, organizationCode };
  } catch (error) {
    console.error("Registration error:", error);
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
    // Validate organization code first
    const isValidCode = await validateOrganizationCode(organizationCode);
    if (!isValidCode) {
      throw new Error("Invalid organization code");
    }

    // Update user document with organization code
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
