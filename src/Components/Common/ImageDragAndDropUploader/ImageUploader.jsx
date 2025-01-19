import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Image,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { FileUploader } from "react-drag-drop-files";
import { BiEdit } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import { LazyLoadedImage } from "../LazyLoadedImage/LazyLoadedImage";
export const ImageUploader = ({
  img,
  onChangeImage,
  onRemoveImage,
  label,
  ...rest
}) => {
  const ImageSrc = useMemo(() => {
    return img && img instanceof File ? URL.createObjectURL(img) : img;
  }, [img]);

  return (
    <Box
      bgColor="gray.100"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      p="10px"
      gap="10px"
      w="100%"
      border="1px"
      borderColor="gray.400"
      borderRadius="md"
      {...rest}
    >
      {ImageSrc ? (
        <Box
          maxW="600px"
          minH="300px"
          minW="200px"
          bgColor="gray.100"
          overflow="hidden"
          border="1px"
          borderColor="gray.400"
          borderRadius="md"
          _hover={{
            img: {
              transform: "scale(1.1)",
              filter: "saturate(1.1)",
            },
          }}
          pos="relative"
        >
          <ButtonGroup pos="absolute" zIndex="10" top="10px" right="10px">
            <IconButton onClick={onRemoveImage} colorScheme="red">
              <GiCancel />
            </IconButton>
            <Button colorScheme="green">
              <label
                htmlFor="1"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <BiEdit />
              </label>
              <input
                onChange={(e) => {
                  onChangeImage(e.target.files[0]);
                }}
                accept="image/jpeg, image/jpg, image/png"
                id="1"
                hidden
                type="file"
              />
            </Button>
          </ButtonGroup>

          <LazyLoadedImage
            ImageProps={{
              transition: "0.3s",
            }}
            decoding="async"
            loading="lazy"
            w="100%"
            h="100%"
            src={ImageSrc}
            bgColor="gray.500"
          />
        </Box>
      ) : (
        <>
          <Button colorScheme="blue">{label}</Button>
          <Flex justifyContent="center" w="100%" overflow="hidden">
            <FileUploader
              handleChange={onChangeImage}
              name="file"
              types={["png", "jpg"]}
              classes="drop_zone"
            />
          </Flex>
        </>
      )}
    </Box>
  );
};
