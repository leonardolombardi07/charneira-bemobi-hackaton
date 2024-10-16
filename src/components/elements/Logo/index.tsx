import { APP_NAME } from "@/app/organization/constants";
import Image from "next/image";
import Box from "@mui/material/Box";
import LogoImage from "../../../../public/images/Logo/Logo.png";

const IMAGE_DIMENSIONS = {
  width: 768,
  height: 768,
};

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export default function Logo({ size = "medium" }: LogoProps) {
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
        width: IMAGE_DIMENSIONS.width / 12,
        height: IMAGE_DIMENSIONS.height / 12,
      };

    case "medium":
      return {
        width: IMAGE_DIMENSIONS.width / 9,
        height: IMAGE_DIMENSIONS.height / 9,
      };

    case "large":
      return {
        width: IMAGE_DIMENSIONS.width / 6,
        height: IMAGE_DIMENSIONS.height / 6,
      };
  }
}

function getSizesFromLargestDimensions() {
  const { width, height } = getDimensions("large");
  return `${width}x${height}`;
}
