import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  Timestamp,
  GeoPoint,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "member";
  organizationCode: string;
  organizationName?: string;
  lastKnownLocation?: GeoPoint;
  lastLocationUpdate?: Timestamp;
  createdAt: Timestamp;
  online?: boolean;
}

// Get user by ID
export const getUserById = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return { uid: userSnap.id, ...userSnap.data() } as UserData;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw error;
  }
};

// Get team members by organization code
export const getTeamMembersByOrganization = async (
  organizationCode: string
) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("organizationCode", "==", organizationCode)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as UserData[];
  } catch (error) {
    console.error("Error getting team members:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  userData: Partial<UserData>
) => {
  try {
    const userRef = doc(db, "users", userId);

    // Remove fields that shouldn't be updated directly
    const { uid, createdAt, organizationCode, role, ...updatableData } =
      userData;

    await updateDoc(userRef, updatableData);

    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Update user online status
export const updateUserOnlineStatus = async (
  userId: string,
  online: boolean
) => {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      online,
      lastOnlineAt: online ? null : Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error updating user online status:", error);
    throw error;
  }
};

// Update user location
export const updateUserLocation = async (
  userId: string,
  coordinates: [number, number]
) => {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      lastKnownLocation: new GeoPoint(coordinates[1], coordinates[0]), // GeoPoint uses (latitude, longitude)
      lastLocationUpdate: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error updating user location:", error);
    throw error;
  }
};

// Get organization details
export const getOrganizationDetails = async (organizationCode: string) => {
  try {
    const orgRef = doc(db, "organizations", organizationCode);
    const orgSnap = await getDoc(orgRef);

    if (!orgSnap.exists()) {
      return null;
    }

    return { id: orgSnap.id, ...orgSnap.data() };
  } catch (error) {
    console.error("Error getting organization details:", error);
    throw error;
  }
};

// Update organization details (admin only)
export const updateOrganizationDetails = async (
  organizationCode: string,
  data: any
) => {
  try {
    const orgRef = doc(db, "organizations", organizationCode);

    await updateDoc(orgRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error updating organization details:", error);
    throw error;
  }
};

export default {
  getUserById,
  getTeamMembersByOrganization,
  updateUserProfile,
  updateUserOnlineStatus,
  updateUserLocation,
  getOrganizationDetails,
  updateOrganizationDetails,
};
