"use client";

import React from "react";
import EditableField from "@/components/inputs/EditableField";
import { updateOrgMember } from "@/modules/api/client";
import { useUser } from "@/app/_layout/UserProvider";
import { useParams } from "next/navigation";
import { updateProfile } from "firebase/auth";

export default function EditableName({ name }: { name: string | undefined }) {
  const params = useParams();
  const { user } = useUser();
  const [value, setValue] = React.useState(name);
  return (
    <EditableField
      value={name || ""}
      onFinishEditing={() => {
        if (!value || value === name) {
          return;
        }
        updateOrgMember(user.uid, params.orgId as string, { name: value });
        updateProfile(user, { displayName: value });
      }}
      typographyProps={{
        variant: "h5",
      }}
      textFieldProps={{
        value,
        onChange: (event) => {
          setValue(event.target.value);
        },
      }}
    />
  );
}
