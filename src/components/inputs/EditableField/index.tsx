import * as React from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";

interface EditableFieldProps {
  value: string;
  onFinishEditing: () => void;
  typographyProps?: React.ComponentProps<typeof Typography>;
  textFieldProps?: React.ComponentProps<typeof TextField>;
  disabled?: boolean;
}

export default function EditableField({
  value,
  onFinishEditing,
  typographyProps,
  textFieldProps,
  disabled,
}: EditableFieldProps) {
  // TODO: put cursor where user clicks rather than at the end
  const [isEditing, setIsEditing] = React.useState(false);
  return (
    <Box>
      {!isEditing ? (
        <Box>
          <Typography
            onClick={() => {
              if (disabled) return;
              setIsEditing(true);
            }}
            sx={{
              cursor: "pointer",
              ...typographyProps?.sx,
              position: "relative",
            }}
            {...typographyProps}
          >
            {value}

            <IconButton
              onClick={() => {
                setIsEditing(true);
              }}
              sx={{
                right: 5,
                top: -15,
                opacity: 0.9,
              }}
              disabled={disabled}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Typography>
        </Box>
      ) : (
        <TextField
          defaultValue={value}
          variant={textFieldProps?.variant || "outlined"}
          autoFocus
          onBlur={(event) => {
            setIsEditing(false);
            if (textFieldProps?.onBlur) {
              textFieldProps.onBlur(event);
            }

            if (onFinishEditing) {
              onFinishEditing();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  mr: 1,
                }}
              >
                <IconButton edge="end">
                  <CheckIcon />
                </IconButton>
              </InputAdornment>
            ),
            ...textFieldProps?.InputProps,
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setIsEditing(false);
              onFinishEditing();
            }

            if (event.key === "Escape") {
              setIsEditing(false);
            }

            if (textFieldProps?.onKeyDown) {
              textFieldProps.onKeyDown(event);
            }
          }}
          {...textFieldProps}
        />
      )}
    </Box>
  );
}
