import { getDocs } from "firebase/firestore";
import { getCollectionGroups } from "../utils";

const { membersColGroup } = getCollectionGroups();

async function findUserOrgId(uid: string) {
  const querySnap = await getDocs(membersColGroup);
  const allMembers = querySnap.docs.map((doc) => doc.data());
  const member = allMembers.find((m) => m.id === uid);
  if (!member) {
    throw new Error("Member not found");
  }

  return member.orgId;
}

export { findUserOrgId };
