import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { generateRandomCode } from "@/utils/codeGenerator";

interface RegisterParams {
  email: string;
  password: string;
  displayName: string;
  organizationName: string;
}

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Signin error:", error);
    throw error;
  }
};

export const registerWithEmailAndPassword = async ({
  email,
  password,
  displayName,
  organizationName,
}: RegisterParams) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Generate a unique organization code
    const organizationCode = generateRandomCode(6);

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName,
      role: "member",
      organizationCode,
      organizationName,
      createdAt: new Date(),
    });

    // Create organization document
    await setDoc(doc(db, "organizations", organizationCode), {
      name: organizationName,
      createdBy: user.uid,
      createdAt: new Date(),
      members: [user.uid],
    });

    return { user, organizationCode };
  } catch (error: any) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Password reset error:", error);
    throw error;
  }
};

export const joinOrganization = async (
  userId: string,
  organizationCode: string
) => {
  try {
    // Check if organization exists
    const orgDoc = await getDoc(doc(db, "organizations", organizationCode));

    if (!orgDoc.exists()) {
      throw new Error("Invalid organization code");
    }

    // Update user document with organization code
    await updateDoc(doc(db, "users", userId), {
      organizationCode,
    });

    // Add user to organization members
    await updateDoc(doc(db, "organizations", organizationCode), {
      members: [...(orgDoc.data().members || []), userId],
    });

    return true;
  } catch (error: any) {
    console.error("Join organization error:", error);
    throw error;
  }
};
