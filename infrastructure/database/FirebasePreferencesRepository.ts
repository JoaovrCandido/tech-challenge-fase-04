import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { IPreferencesRepository, UserPreferences } from "@/core/domain/repositories/IPreferencesRepository";

export class FirebasePreferencesRepository implements IPreferencesRepository {
  async getPreferences(userId: string): Promise<UserPreferences | null> {
    const docRef = doc(db, "user_preferences", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserPreferences;
    }
    return null;
  }

  async savePreferences(userId: string, preferences: UserPreferences): Promise<void> {
    const docRef = doc(db, "user_preferences", userId);
    await setDoc(docRef, preferences);
  }
}

export const preferencesRepository = new FirebasePreferencesRepository();