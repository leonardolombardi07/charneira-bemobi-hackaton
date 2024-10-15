import { OrganizationsCol } from "@/modules/api/types";
import { getCollections } from "../../utils";
import { CollectionReference, collection } from "firebase/firestore";

const { organizationsCol } = getCollections();

function getOrganizationSubcollections(orgId: string) {
  const membersCol = collection(
    organizationsCol,
    orgId,
    "members"
  ) as CollectionReference<OrganizationsCol.MembersSubCol.Doc>;

  const conversationsCol = collection(
    organizationsCol,
    orgId,
    "conversations"
  ) as CollectionReference<OrganizationsCol.ConversationsSubCol.Doc>;

  const productsCol = collection(
    organizationsCol,
    orgId,
    "products"
  ) as CollectionReference<OrganizationsCol.ProductsSubCol.Doc>;

  const agentsCol = collection(
    organizationsCol,
    orgId,
    "agents"
  ) as CollectionReference<OrganizationsCol.AgentsSubCol.Doc>;

  return { membersCol, conversationsCol, productsCol, agentsCol };
}

export { getOrganizationSubcollections };
