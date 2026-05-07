export interface UserData {
  uid: string;
  email: string | null;
}

export interface IAuthService {
  login(email: string, pass: string): Promise<UserData>;
  register(email: string, pass: string): Promise<UserData>;
  logout(): Promise<void>;
  onAuthStateChanged(callback: (user: UserData | null) => void): () => void;
}