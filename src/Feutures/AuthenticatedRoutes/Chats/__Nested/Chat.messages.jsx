import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { Link, useParams } from "react-router-dom";
import { LazyLoadedImage } from "../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { FaFile } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { BsEmojiGrin } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { useChatSocket } from "../../../../Hooks/useChatSocket/useChatSocket";
import { useApiRequest } from "../../../../Hooks/useApiRequest/useApiRequest";
const ChatBox = ({
  isGroupChat,
  participants,
  image,
  name,
  description,
  createdAt,
  _id,
}) => {
  const { user } = useAuth();
  if (isGroupChat) {
    return (
      <>
        <Flex
          flexShrink="0"
          w="100%"
          bgColor="white"
          p="3"
          gap="5"
          _hover={{
            bgColor: "gray.100",
          }}
          justifyContent="space-between"
        >
          <Flex w="100%" maxW="500px" gap="4" alignItems="start">
            <LazyLoadedImage
              ImageProps={{
                objectFit: "cover",
              }}
              src={image}
              w="80px"
              h="80px"
              borderRadius="lg"
            />
            <Stack gap="1" w="100%" maxW="200px">
              <Text>العنوان : {name}</Text>
              <Text>عدد الاعضاء : {participants?.length}</Text>
            </Stack>
          </Flex>
          <Flex w="fit-content" alignItems="center" gap="5">
            <AvatarGroup size="sm" max={2}>
              {participants.map(({ userDetails }) => {
                return (
                  <Avatar
                    key={userDetails.id}
                    name={userDetails.username}
                    src={userDetails.profileImg}
                  />
                );
              })}
            </AvatarGroup>
            <Button size="sm" colorScheme="green" borderRadius="full">
              شات مجموعة
            </Button>
          </Flex>
        </Flex>
        <Divider />
      </>
    );
  }
  const [UserChat] = participants?.filter(({ userDetails: UserChat }) => {
    return UserChat.email !== user.data.email;
  }) || [{}];
  return (
    <>
      <Flex
        flexShrink="0"
        w="100%"
        bgColor="white"
        p="3"
        gap="5"
        _hover={{
          bgColor: "gray.100",
        }}
        justifyContent="space-between"
      >
        <Flex gap="4" alignItems="start">
          <Avatar
            src={UserChat?.userDetails?.profileImg}
            name={UserChat?.userDetails?.username}
          />
          <Stack gap="1" w="100%" maxW="200px">
            <Text>العنوان : {UserChat.userDetails?.username}</Text>
            <Text fontSize="sm">الايميل : {UserChat.userDetails?.email}</Text>
          </Stack>
        </Flex>
        <Flex justifyContent="end" gap="3">
          <Button size="sm" colorScheme="blue" borderRadius="full">
            شات فردي
          </Button>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

const ChatMessage = ({ message, user }) => {
  const {
    isOpen: isOpenedEmojiiPicker,
    onOpen: onOpenEmojiiPicker,
    onClose: onCloseEmojiiPicker,
    onToggle: onToggleEmojiiPicker,
  } = useDisclosure();
  return (
    <>
      <Flex
        flexDir={message.sender._id === user._id ? "row-reverse" : "row"}
        gap="2"
        alignItems="center"
        pos="relative"
      >
        <Modal
          isCentered
          isOpen={isOpenedEmojiiPicker}
          onClose={onCloseEmojiiPicker}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Pick An Emojii</ModalHeader>
            <ModalBody>
              <EmojiPicker
                style={{
                  width: "100%",
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        <Avatar
          size="sm"
          src={message.sender.profileImg}
          name={message.sender.username}
        />
        <Box
          bgColor="gray.100"
          px="3"
          py="2"
          borderRadius="full"
          w="fit-content"
        >
          {message.text}
          <IconButton
            colorScheme="orange"
            size="sm"
            borderRadius="full"
            mr="2"
            variant="ghost"
            onClick={onToggleEmojiiPicker}
          >
            <BsEmojiGrin />
          </IconButton>
        </Box>
        {message.media.map((item) => {
          return (
            <IconButton
              colorScheme="orange"
              borderRadius="full"
              size="sm"
              key={item._id}
              as="a"
              href={item.url}
              target="_blank"
            >
              <FaFile />
            </IconButton>
          );
        })}
      </Flex>
    </>
  );
};

const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState();
  return (
    <Flex gap="3">
      <Input
        onChange={(e) => setMessage(e.target.value)}
        placeholder="ارسال رسالة"
        size="lg"
        value={message}
      />
      <IconButton
        isLoading={isLoading}
        onClick={async () => {
          await onSend(message);
          setMessage("");
        }}
        colorScheme="blue"
        size="lg"
      >
        <IoIosSend />
      </IconButton>
    </Flex>
  );
};

export default function ChatPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [allMessages, setAllMessages] = useState([]);

  // Socket connection
  const {
    connected,
    messages: socketMessages,
    error: socketError,
    joinRoom,
    leaveRoom,
    sendPrivateMessage,
    sendGroupMessage,
  } = useChatSocket(user.data._id);

  // Initial chat details and messages fetch
  const {
    data: chatDetails,
    loading: chatDetailsLoading,
    error: chatDetailsError,
  } = useFetch({
    endpoint: `/chats/${id}/details`,
  });

  const {
    data: fetchedMessages,
    loading: messagesLoading,
    error: messagesError,
  } = useFetch({
    endpoint: `/messages/${id}`,
  });

  // API request for sending messages
  const {
    loading: sendMessageLoading,
    error: sendMessageError,
    sendRequest: onSendMessage,
  } = useApiRequest();

  useEffect(() => {
    joinRoom(id);
    return () => {
      leaveRoom(id);
    };
  }, [id, joinRoom, leaveRoom]);

  useEffect(() => {
    if (fetchedMessages?.data) {
      setAllMessages(fetchedMessages.data);
    }
  }, [fetchedMessages]);
  console.log(socketMessages);
  useEffect(() => {
    if (socketMessages && socketMessages.payload) {
      const newMessage = {
        _id: Date.now(), // Temporary ID until refresh
        text: socketMessages.payload,
        sender: {
          _id: socketMessages.senderId,
          // You might want to fetch user details here or store them differently
          profileImg: "", // Add default or fetch user details
          username: "", // Add default or fetch user details
        },
        media: [],
      };

      setAllMessages((prev) => [...prev, newMessage]);
    }
  }, [socketMessages]);

  const handleSendMessage = async (message) => {
    try {
      // Send to backend
      const response = await onSendMessage({
        url: `/messages/${id}`,
        body: {
          text: message,
        },
        method: "post",
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      // Emit through socket
      sendGroupMessage({
        roomId: id,
        payload: message,
        action: "message",
      });

      // Optionally add message to local state immediately
      const newMessage = {
        _id: response?.data?._id || Date.now(),
        text: message,
        sender: {
          _id: user.data._id,
          profileImg: user.data.profileImg,
          username: user.data.username,
        },
        media: [],
      };

      setAllMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <Stack p="3" borderRadius="lg" bgColor="white" w="100%">
      {chatDetailsLoading ? (
        <Skeleton h="100px" w="100%" />
      ) : (
        <ChatBox {...chatDetails?.data} />
      )}

      <Stack h="100%" as={Skeleton} isLoaded={!messagesLoading}>
        {allMessages.map(
          (message) =>
            message.text && (
              <ChatMessage
                key={message._id}
                user={user.data}
                message={message}
              />
            )
        )}
      </Stack>

      <ChatInput isLoading={sendMessageLoading} onSend={handleSendMessage} />
    </Stack>
  );
}
