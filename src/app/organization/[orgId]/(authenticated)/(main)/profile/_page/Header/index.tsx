import React from "react";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SignOutButton from "./SignOutButton";
import RequestChangePasswordButton from "./RequestChangePasswordButton";
import Skeleton from "@mui/material/Skeleton";
import EditableAvatar from "./EditableAvatar";
import EditableName from "./EditableName";

interface HeaderProps {
  name: string | undefined;
  email: string | null | undefined;
}

export default function Header({ name, email }: HeaderProps) {
  return (
    <Paper>
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <EditableAvatar />

            <Box sx={{ mr: 3 }} />

            <Box>
              <EditableName name={name} />

              <Typography
                variant="body2"
                component="div"
                color="text.secondary"
              >
                {email}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <HeaderCardActions />
      </Card>
    </Paper>
  );
}

export function HeaderSkeleton() {
  return (
    <Paper
      sx={{
        height: 150,
      }}
    >
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Skeleton
              animation="wave"
              variant="rounded"
              width={65}
              height={65}
            />

            <Box sx={{ mr: 3 }} />

            <Box>
              <Skeleton width="70%" animation="wave" variant="text" />

              <Skeleton animation="wave" variant="text" width={250} />
            </Box>
          </Box>
        </CardContent>

        <HeaderCardActions />
      </Card>
    </Paper>
  );
}

function HeaderCardActions() {
  return (
    <CardActions>
      <RequestChangePasswordButton />
      <SignOutButton />
    </CardActions>
  );
}
