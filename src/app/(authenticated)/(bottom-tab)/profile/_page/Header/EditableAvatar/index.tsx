"use client";

import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useUser } from "@/app/_layout/UserProvider";
import {
  deleteUserAvatar,
  uploadUserAvatar,
  useFirestoreUser,
} from "@/modules/api/client";
import useDelay from "@/modules/hooks/useDelay";
import Skeleton from "@mui/material/Skeleton";

interface EditableAvatarProps {
  isAnonymous: boolean;
}

export default function EditableAvatar({ isAnonymous }: EditableAvatarProps) {
  const { user } = useUser();

  // TODO: Here we are sure that firestoreUser is not undefined, but maybe we should pass it as a prop
  const [firestoreUser] = useFirestoreUser();

  const [isUploading, setIsUploading] = React.useState(false);
  const delayedIsUploading = useDelay(isUploading);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const { open: isSnackbarOpen, openSnackbar, closeSnackbar } = useSnackbar();

  async function onDelete() {
    if (isUploading) return;

    setUploadError(null);
    setIsUploading(true);
    try {
      await deleteUserAvatar(user.uid);
    } catch (error: any) {
      openSnackbar();
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function onUpload(file: File) {
    if (isUploading) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      await uploadUserAvatar(user.uid, file);
    } catch (error: any) {
      openSnackbar();
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  if (delayedIsUploading) {
    return (
      <Skeleton animation="wave" variant="rounded" width={65} height={65} />
    );
  }

  const name = firestoreUser?.name;

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 65,
            height: 65,
            position: "relative",
          }}
        >
          <Avatar
            sx={{
              position: "relative",
              width: 65,
              height: 65,
            }}
          >
            {firestoreUser?.photoURL ? (
              <img src={firestoreUser?.photoURL} sizes="65px" />
            ) : name ? (
              name[0]
            ) : (
              "A"
            )}
          </Avatar>

          {firestoreUser?.photoURL && (
            <Fab
              size="small"
              color="error"
              component={"span"}
              sx={{
                position: "absolute",
                top: -15,
                right: -15,
                width: "35px",
                height: "30px",
              }}
              onClick={onDelete}
            >
              <DeleteIcon
                sx={{
                  fontSize: "15px",
                }}
              />
            </Fab>
          )}

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-upload-button"
            type="file"
            onChange={(event) => {
              const file =
                event.target.files?.length === 1 && event.target.files[0];

              if (file) {
                onUpload(file);
              }
            }}
            onClick={(event) => {
              const input = event.target as HTMLInputElement;
              input.value = "";
            }}
          />

          <label htmlFor="avatar-upload-button">
            <Fab
              size="small"
              component={"span"}
              sx={{
                position: "absolute",
                bottom: -15,
                right: -15,
                width: "35px",
                height: "30px",
              }}
              disabled={isAnonymous}
            >
              <EditIcon
                sx={{
                  fontSize: "15px",
                }}
              />
            </Fab>
          </label>
        </Box>
      </Box>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={15000}
        onClose={closeSnackbar}
      >
        <Alert severity="error" onClose={closeSnackbar} sx={{ width: "100%" }}>
          Erro: {uploadError}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

function useSnackbar() {
  const [open, setOpen] = React.useState(false);

  function openSnackbar() {
    setOpen(true);
  }

  function closeSnackbar() {
    setOpen(false);
  }

  return { open, openSnackbar, closeSnackbar };
}
