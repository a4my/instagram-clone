import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from './firebaseConfig';

export default function handleResetNewHearts(username: string) {
  const db = getFirestore(app);
  const userRef = doc(db, `users/${username}`);
  updateDoc(userRef, {
    newHeart: false,
  });
}
