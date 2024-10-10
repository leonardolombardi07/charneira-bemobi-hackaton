import { getServices } from "../../services";
import {
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import { updateUser } from ".";

const { storage } = getServices();

function getAvatarRef(uid: string) {
  return ref(storage, `users/${uid}/photo_URL`);
}

async function uploadUserAvatar(uid: string, file: File) {
  const avatarRef = getAvatarRef(uid);
  const result = await uploadBytes(avatarRef, file, {
    contentType: "image/jpeg",
  });
  const downloadURL = await getDownloadURL(result.ref);
  return updateUser(uid, { photoURL: downloadURL });
}

async function deleteUserAvatar(uid: string) {
  const avatarRef = getAvatarRef(uid);
  await deleteObject(avatarRef);
  return updateUser(uid, { photoURL: "" });
}

export { uploadUserAvatar, deleteUserAvatar };
