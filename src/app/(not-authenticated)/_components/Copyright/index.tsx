import Typography, { TypographyProps } from "@mui/material/Typography";
import MUILink from "@mui/material/Link";
import Link from "next/link";
import { APP_NAME, APP_BASE_URL } from "@/app/constants";

interface CopyrightProps extends TypographyProps {}

function Copyright(props: CopyrightProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <MUILink
        component={Link}
        target="_blank"
        rel="noopener"
        color="inherit"
        href={APP_BASE_URL}
      >
        {APP_NAME}
      </MUILink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default Copyright;
