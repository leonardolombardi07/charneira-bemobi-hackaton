import { FirebaseError } from "firebase/app";

export interface Observer<T> {
  next: (data: T) => void;
  error?: (error: FirebaseError) => void;
  complete?: () => void;
}
