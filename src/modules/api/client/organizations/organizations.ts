import { getDocs, orderBy, query } from "firebase/firestore";
import { getCollectionGroups, getCollections } from "../utils";
import { useCollectionData } from "react-firebase-hooks/firestore";

const { organizationsCol } = getCollections();
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

function useLastCreatedOrganization() {
  const [orgs, isLoading, error] = useCollectionData(
    query(organizationsCol, orderBy("createdAt", "desc"))
  );
  return [orgs ? orgs[0] : undefined, isLoading, error] as const;
}

export { findUserOrgId, useLastCreatedOrganization };
