import { APP_NAME } from "@/app/organization/constants";
import Image from "next/image";
import Box from "@mui/material/Box";
import LogoImage from "../../../../../public/images/VivoLogo/Logo.png";

const IMAGE_DIMENSIONS = {
  width: 768,
  height: 768,
};

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export default function VivoLogo({ size = "medium" }: LogoProps) {
  return (
    <Box
      sx={{
        display: "block",
        position: "relative",
        ...getDimensions(size),
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <Image
        src={LogoImage}
        alt={`${APP_NAME} Logo`}
        fill={true}
        style={{
          objectFit: "contain",
        }}
        priority
        sizes={getSizesFromLargestDimensions()}
      />
    </Box>
  );
}

function getDimensions(size: "small" | "medium" | "large") {
  switch (size) {
    case "small":
      return {
        width: IMAGE_DIMENSIONS.width / 8,
        height: IMAGE_DIMENSIONS.height / 8,
      };

    case "medium":
      return {
        width: IMAGE_DIMENSIONS.width / 6,
        height: IMAGE_DIMENSIONS.height / 6,
      };

    case "large":
      return {
        width: IMAGE_DIMENSIONS.width / 4,
        height: IMAGE_DIMENSIONS.height / 4,
      };
  }
}

function getSizesFromLargestDimensions() {
  const { width, height } = getDimensions("large");
  return `${width}x${height}`;
}
