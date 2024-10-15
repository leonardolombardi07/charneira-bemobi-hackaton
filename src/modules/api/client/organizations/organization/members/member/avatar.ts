import { getServices } from "@/modules/api/client/services";
import {
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import { updateOrgMember } from "./index";

const { storage } = getServices();

function getAvatarRef(memberId: string, orgId: string) {
  return ref(storage, `organizations/${orgId}/,members/${memberId}/photo_URL`);
}

async function uploadOrgMemberAvatar(
  memberId: string,
  orgId: string,
  file: File
) {
  const avatarRef = getAvatarRef(memberId, orgId);
  const result = await uploadBytes(avatarRef, file, {
    contentType: "image/jpeg",
  });
  const downloadURL = await getDownloadURL(result.ref);
  return updateOrgMember(memberId, orgId, { photoURL: downloadURL });
}

async function deleteOrgMemberAvatar(memberId: string, orgId: string) {
  const avatarRef = getAvatarRef(memberId, orgId);
  await deleteObject(avatarRef);
  return updateOrgMember(memberId, orgId, { photoURL: "" });
}

export { uploadOrgMemberAvatar, deleteOrgMemberAvatar };
