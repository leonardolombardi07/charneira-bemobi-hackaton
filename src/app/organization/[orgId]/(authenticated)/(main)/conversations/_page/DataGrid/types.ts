import { OrganizationsCol } from "@/modules/api";

export type Row = Omit<OrganizationsCol.ConversationsSubCol.Doc, "members"> & {
  agents: OrganizationsCol.ConversationsSubCol.ConversationMember[];
  customers: OrganizationsCol.ConversationsSubCol.ConversationMember[];
};
