import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { ConversationsCol } from "@/modules/api";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface ConversationListProps {
  data: ConversationsCol.Doc[];
  isLoading: boolean;
  error: Error | undefined | null;
}

export default function ConversationsList({
  data,
  isLoading,
  error,
}: ConversationListProps) {
  // TODO: handle loading

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Erro</AlertTitle>
        {error.message}
      </Alert>
    );
  }

  if (data.length === 0 && !isLoading) {
    return <EmptyList />;
  }

  return (
    <List
      sx={{
        width: "100%",
        p: 0,
      }}
    >
      {data.map((conversation) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
        />
      ))}
    </List>
  );
}

interface ConversationListItemProps {
  conversation: ConversationsCol.Doc;
}

function ConversationListItem({ conversation }: ConversationListItemProps) {
  const { id, title, lastPart } = conversation;

  return (
    <React.Fragment>
      <ListItemButton
        alignItems="flex-start"
        LinkComponent={Link}
        href={`/conversations/${id}`}
      >
        <ListItemAvatar>
          <Avatar
            alt={lastPart?.author?.name}
            src={lastPart?.author?.photoURL}
          />
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: "text.primary",
                  display: "inline",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {lastPart?.author?.name || "0 mensagens"}
              </Typography>

              {lastPart?.body && ` — ${lastPart?.body}`}
            </React.Fragment>
          }
          sx={{
            maxHeight: 100,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        />
      </ListItemButton>

      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
}

function EmptyList() {
  return (
    <Typography
      variant="body1"
      sx={{ textAlign: "center", mt: 5, fontSize: "1rem" }}
    >
      Você ainda não possui nenhuma conversa.
    </Typography>
  );
}
