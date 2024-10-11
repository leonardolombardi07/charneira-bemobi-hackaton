import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Logo from "@/components/elements/Logo";
import { APP_NAME } from "@/app/constants";

interface LogoWithTitleProps {
  sx?: BoxProps["sx"];
}

export default function LogoWithTitle({ sx }: LogoWithTitleProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      <Logo size="medium" />
      <Typography
        variant="h5"
        component="h2"
        color={(t) => {
          const isDark = t.palette.mode === "dark";
          return isDark ? "secondary.main" : "inherit";
        }}
        sx={{
          ml: "3px",
        }}
      >
        {APP_NAME}
      </Typography>
    </Box>
  );
}
