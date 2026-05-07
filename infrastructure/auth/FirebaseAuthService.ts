import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { IAuthService, UserData } from "@/core/domain/services/IAuthService";

export class FirebaseAuthService implements IAuthService {
  async login(email: string, pass: string): Promise<UserData> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return { uid: cred.user.uid, email: cred.user.email };
  }

  async register(email: string, pass: string): Promise<UserData> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    return { uid: cred.user.uid, email: cred.user.email };
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  onAuthStateChanged(callback: (user: UserData | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({ uid: user.uid, email: user.email });
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new FirebaseAuthService();