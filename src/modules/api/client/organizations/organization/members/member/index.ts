import { doc, setDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { OrganizationsCol } from "@/modules/api/types";
import { getOrganizationSubcollections } from "../../utils";

function useOrgMember(orgId: string, memberId: string) {
  const { membersCol } = getOrganizationSubcollections(orgId);
  const [item, isLoading, error] = useDocumentData(doc(membersCol, memberId));
  return [item, isLoading, error] as const;
}

async function updateOrgMember(
  memberId: string,
  orgId: string,
  data: Partial<OrganizationsCol.MembersSubCol.Doc>
) {
  const { membersCol } = getOrganizationSubcollections(orgId);
  await setDoc(
    doc(membersCol, memberId),
    {
      ...data,
    },
    { merge: true }
  );
}

export { useOrgMember, updateOrgMember };
