import MUILink, { LinkProps as MUILinkProps } from "@mui/material/Link";
import { useNavigateWithSearchParams } from "@/modules/navigation";

interface AuthLinkProps extends MUILinkProps {
  href: string;
}

export default function AuthLink({ href, children, ...props }: AuthLinkProps) {
  const navigateWithSearchParams = useNavigateWithSearchParams();

  return (
    <MUILink
      onClick={(event) => {
        event.preventDefault();
        navigateWithSearchParams(href);
      }}
      variant="body2"
      sx={{
        cursor: "pointer",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </MUILink>
  );
}
