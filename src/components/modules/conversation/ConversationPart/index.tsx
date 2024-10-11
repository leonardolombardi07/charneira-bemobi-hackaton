import { ConversationsCol } from "@/modules/api";
import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
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

  return (
    <ConversationPartContainer part={part}>
      <Markdown>{body}</Markdown>
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

  const float = author.type === "user" ? "right" : "left";

  const paddingLeft = {
    xs: 0,
    sm: 48,
  };

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
          float,
          paddingLeft: {
            xs: `${paddingLeft.xs}px`,
            sm: `${paddingLeft.sm}px`,
          },
          width: {
            xs: `calc(100% - ${paddingLeft.xs}px)`,
            sm: `calc(100% - ${paddingLeft.sm}px)`,
          },
          mb: 1,
        }}
      >
        <Tooltip
          title={humanReadableDate(part.createdAt)}
          placement="top-start"
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [-30, -30],
                },
              },
            ],
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              float,
              borderRadius: 5,
              p: 3,
              maxWidth: {
                xs: "90%",
                sm: "75%",
              },
              ...sxForAuthorType(author.type),
            }}
          >
            {children}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}

function humanReadableDate(timestamp: number) {
  // TODO: eventually abstract this to a module

  function getLocale() {
    return navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;
  }

  return new Intl.DateTimeFormat(getLocale(), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(timestamp);
}
