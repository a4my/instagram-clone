/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { useAtom } from 'jotai';
import atoms, { postType } from '../util/atoms';
import app from '../util/firebaseConfig';

function useGetOtherUserPosts({
  user,
  nameSearch,
  limitSearch,
}: {
  user: {
    userExists: boolean;
    otherUser: boolean;
  };
  nameSearch: string | string[] | undefined;
  limitSearch: boolean;
}) {
  const db = getFirestore(app);

  const [userDetails] = useAtom(atoms.userDetails);
  const [, setListeners] = useAtom(atoms.listeners);

  const [profilePosts, setProfilePosts] = React.useState<postType[]>([]);

  function getUserPosts() {
    const q = query(
      collection(db, `${nameSearch}Posts`),
      orderBy('createdAt', 'desc'),
      limitSearch ? limit(1) : limit(50)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray: postType[] = [];
      querySnapshot.forEach(
        (document: firebase.firestore.DocumentSnapshot<postType>) => {
          postsArray.push(document.data());
        }
      );
      setProfilePosts(postsArray);
    });
    try {
      setListeners((current) => [...current, unsubscribe]);
    } catch (error) {
      console.error('Error setting listener:', error);
    }
  }

  React.useEffect(() => {
    if (
      user.userExists &&
      user.otherUser &&
      nameSearch !== userDetails.displayName
    ) {
      getUserPosts();
    } else if (limitSearch) {
      getUserPosts();
    }
  }, [user.userExists, user.otherUser, nameSearch]);

  return { profilePosts };
}

export default useGetOtherUserPosts;
