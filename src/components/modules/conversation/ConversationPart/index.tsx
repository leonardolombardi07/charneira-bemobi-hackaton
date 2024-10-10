import { ConversationsCol } from "@/modules/api";
import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Markdown from "react-markdown";

interface ConversationPartProps {
  part_type: ConversationsCol.PartsSubCol.Doc["type"];
  part: ConversationsCol.PartsSubCol.Doc;
  onReply: (
    replyOption: ConversationsCol.PartsSubCol.ConversationPartReplyOption
  ) => void;
}

export default function ConversationPart(props: ConversationPartProps) {
  if (props.part_type === "quick_reply") {
    return <QuickReplyConversationPart {...props} />;
  }

  return <CommentConversationPart {...props} />;
}

function QuickReplyConversationPart({ part, onReply }: ConversationPartProps) {
  const { replyOptions } = part;
  return (
    <ConversationPartContainer part={part}>
      <Box sx={{ display: "flex", gap: 2 }}>
        {replyOptions.map((option) => (
          <Box key={option.id} onClick={() => onReply(option)}>
            <Typography variant="body1">{option.text}</Typography>
          </Box>
        ))}
      </Box>
    </ConversationPartContainer>
  );
}

function CommentConversationPart({ part }: ConversationPartProps) {
  const { body } = part;

  // TODO: parsing
  return (
    <ConversationPartContainer part={part}>
      <Typography variant="body1">{body}</Typography>
      {/* <Markdown>{body}</Markdown> */}
    </ConversationPartContainer>
  );
}

function ConversationPartContainer({
  part,
  children,
}: {
  part: ConversationsCol.PartsSubCol.Doc;
  children: React.ReactNode;
}) {
  const { author } = part;

  function sxForAuthorType(
    authorType: ConversationsCol.PartsSubCol.ConversationPartAuthor["type"]
  ): BoxProps["sx"] {
    switch (authorType) {
      case "user":
        return {
          bgcolor: "background.paper",
          color: "text.primary",
        };
      case "bot":
        return {
          bgcolor: "secondary.main",
          color: "secondary.contrastText",
        };
      default:
        return {
          bgcolor: "background.paper",
          color: "text.primary",
        };
    }
  }

  return (
    <Box
      sx={{
        "&::before": {
          display: "table",
          content: "' '",
        },

        "&::after": {
          clear: "both",
        },
      }}
    >
      <Box
        sx={{
          textAlign: "left",
          float: author.type === "user" ? "right" : "left",
          paddingLeft: "48px",
          width: "calc(100% - 48px)",
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            float: author.type === "user" ? "right" : "left",
            borderRadius: 5,
            p: 3,
            maxWidth: "75%",
            ...sxForAuthorType(author.type),
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
