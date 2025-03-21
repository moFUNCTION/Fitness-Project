import {
  Avatar,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { LazyLoadedImage } from "../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import EmojiPicker from "emoji-picker-react";
import { MdEmojiEmotions } from "react-icons/md";

export const ChatMessage = ({ Sender, message, media, id, onSendEmojii }) => {
  const { user } = useAuth();
  const {
    isOpen: isEmojiPickerOpen,
    onOpen: openEmojiPicker,
    onClose: closeEmojiPicker,
  } = useDisclosure();

  return (
    <Flex
      borderRadius="full"
      w="fit-content"
      h="fit-content"
      px="6"
      py="2"
      transition="0.3s"
      _hover={{
        bgColor: "gray.200",
      }}
      gap="4"
      alignItems="center"
      flexDir={
        user?.data?._id === Sender?.userDetails?._id ? "row-reverse" : "row"
      }
      mr={user?.data?._id === Sender?.userDetails?._id && "auto"}
    >
      <Avatar
        size="sm"
        name={Sender?.userDetails?.username}
        src={Sender?.userDetails?.profileImg}
      />

      {message && (
        <Text bgColor="gray.100" p="3" borderRadius="full">
          {message}
        </Text>
      )}

      {media?.map((item) => {
        if (item.type === "audio" || item.type === "text") {
          return <audio controls src={item.url} key={item?.url} />;
        }
        if (item.type === "image") {
          return (
            <a
              key={item?.url}
              href={item?.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LazyLoadedImage
                _hover={{ transform: "scale(1.1)" }}
                w="100px"
                borderRadius="xl"
                src={item?.url}
              />
            </a>
          );
        }
      })}

      <IconButton
        onClick={openEmojiPicker}
        borderRadius="full"
        colorScheme="orange"
        variant="outline"
        icon={<MdEmojiEmotions />}
      />

      <Modal isOpen={isEmojiPickerOpen} onClose={closeEmojiPicker} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select an Emoji</ModalHeader>
          <ModalCloseButton />
          <ModalBody as={Stack}>
            <EmojiPicker
              style={{
                width: "100%",
              }}
              onEmojiClick={(emoji) => {
                console.log(emoji.emoji);
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
