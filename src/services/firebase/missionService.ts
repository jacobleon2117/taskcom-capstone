import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  GeoPoint,
} from "firebase/firestore";
import { db } from "@/config/firebase";

// Types
export interface Pin {
  id?: string;
  coordinate: [number, number]; // [longitude, latitude]
  title: string;
  description: string;
  createdBy: string;
  createdAt: Timestamp;
  type: "observation" | "alert" | "point-of-interest";
}

export interface MissionData {
  id?: string;
  title: string;
  startedAt: Timestamp;
  endedAt?: Timestamp;
  isActive: boolean;
  teamMembers: string[]; // User IDs
  createdBy: string; // User ID of admin or self
  pins: Pin[];
  type: "team" | "individual" | "training";
  distanceCovered?: number; // In meters
  duration?: number; // In seconds
}

// Create a new mission
export const createMission = async (missionData: Omit<MissionData, "id">) => {
  try {
    // Convert any GeoPoint data
    const formattedData = {
      ...missionData,
      startedAt: Timestamp.now(),
      pins: [],
    };

    const docRef = await addDoc(collection(db, "missions"), formattedData);
    return { id: docRef.id, ...formattedData };
  } catch (error) {
    console.error("Error creating mission:", error);
    throw error;
  }
};

// End a mission
export const endMission = async (missionId: string) => {
  try {
    const missionRef = doc(db, "missions", missionId);

    await updateDoc(missionRef, {
      isActive: false,
      endedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error ending mission:", error);
    throw error;
  }
};

// Add a pin to a mission
export const addPinToMission = async (
  missionId: string,
  pinData: Omit<Pin, "id" | "createdAt">
) => {
  try {
    const missionRef = doc(db, "missions", missionId);
    const missionSnap = await getDoc(missionRef);

    if (!missionSnap.exists()) {
      throw new Error("Mission not found");
    }

    const missionData = missionSnap.data() as MissionData;
    const newPin = {
      ...pinData,
      createdAt: Timestamp.now(),
      id: `pin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    const updatedPins = [...(missionData.pins || []), newPin];

    await updateDoc(missionRef, {
      pins: updatedPins,
    });

    return newPin;
  } catch (error) {
    console.error("Error adding pin to mission:", error);
    throw error;
  }
};

// Get active mission for a user
export const getActiveMissionForUser = async (userId: string) => {
  try {
    const missionsRef = collection(db, "missions");
    const q = query(
      missionsRef,
      where("teamMembers", "array-contains", userId),
      where("isActive", "==", true)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const missionDoc = querySnapshot.docs[0];
    return { id: missionDoc.id, ...missionDoc.data() } as MissionData;
  } catch (error) {
    console.error("Error getting active mission:", error);
    throw error;
  }
};

// Get mission reports for a user
export const getMissionReportsForUser = async (userId: string) => {
  try {
    const missionsRef = collection(db, "missions");
    const q = query(
      missionsRef,
      where("teamMembers", "array-contains", userId),
      where("isActive", "==", false),
      orderBy("startedAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MissionData[];
  } catch (error) {
    console.error("Error getting mission reports:", error);
    throw error;
  }
};

// Update user location during a mission
export const updateUserLocation = async (
  userId: string,
  missionId: string,
  coordinates: [number, number]
) => {
  try {
    // Update the user's location in their user document
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      lastKnownLocation: new GeoPoint(coordinates[1], coordinates[0]), // GeoPoint uses (latitude, longitude)
      lastLocationUpdate: Timestamp.now(),
    });

    // Also store the coordinates in the mission's location history for the user
    const missionRef = doc(db, "missions", missionId);
    const missionSnap = await getDoc(missionRef);

    if (!missionSnap.exists()) {
      throw new Error("Mission not found");
    }

    const locationEntry = {
      userId,
      timestamp: Timestamp.now(),
      coordinates: new GeoPoint(coordinates[1], coordinates[0]),
    };

    // Get existing location history or create a new array
    const missionData = missionSnap.data();
    const locationHistory = missionData.locationHistory || [];

    await updateDoc(missionRef, {
      locationHistory: [...locationHistory, locationEntry],
    });

    return true;
  } catch (error) {
    console.error("Error updating user location:", error);
    throw error;
  }
};

export default {
  createMission,
  endMission,
  addPinToMission,
  getActiveMissionForUser,
  getMissionReportsForUser,
  updateUserLocation,
};
