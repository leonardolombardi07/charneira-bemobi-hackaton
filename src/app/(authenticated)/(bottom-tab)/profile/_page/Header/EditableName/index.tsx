"use client";

import React from "react";
import EditableField from "@/components/inputs/EditableField";
import { updateUser } from "@/modules/api/client";
import { useUser } from "@/app/_layout/UserProvider";

interface EditableNameProps {
  name: string | undefined;
  isAnonymous: boolean;
}

export default function EditableName({ name, isAnonymous }: EditableNameProps) {
  const { user } = useUser();
  const [value, setValue] = React.useState(name);
  return (
    <EditableField
      value={name || ""}
      disabled={isAnonymous}
      onFinishEditing={() => {
        if (!value || value === name) {
          return;
        }
        updateUser(user.uid, { name: value });
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
