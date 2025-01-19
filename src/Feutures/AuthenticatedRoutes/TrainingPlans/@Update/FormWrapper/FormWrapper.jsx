import { Stack } from "@chakra-ui/react";
import { LazyLoadedImage } from "../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import BackgroundImage from "../../../../../Assets/Backgrounds/Image.jpg";
export const FormWrapper = ({ children }) => {
  return (
    <Stack
      alignItems="center"
      w="100%"
      h="100%"
      pos="relative"
      zIndex="2"
      p="4"
      background="linear-gradient(70deg, rgba(24,16,163,1) 0%, rgba(6,6,172,1) 9%, rgba(0,150,198,1) 100%)"
      overflow="auto"
      sx={{
        "> *": {
          flexShrink: 0,
        },
      }}
    >
      {/* <LazyLoadedImage
        w="100%"
        h="100%"
        inset="0"
        pos="absolute"
        ImageProps={{
          objectFit: "cover",
          filter: "saturate(0)",
          opacity: "0.2",
        }}
        zIndex="-1"
        src={BackgroundImage}
      /> */}
      {children}
    </Stack>
  );
};
