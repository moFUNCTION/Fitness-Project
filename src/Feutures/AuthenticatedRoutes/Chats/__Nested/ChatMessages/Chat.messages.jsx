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
import { useFetch } from "../../../../../Hooks/useFetch/useFetch";
import { Link, useParams } from "react-router-dom";
import { LazyLoadedImage } from "../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { useAuth } from "../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { FaFile } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { BsEmojiGrin } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { useChatSocket } from "../../../../../Hooks/useChatSocket/useChatSocket";
import { useApiRequest } from "../../../../../Hooks/useApiRequest/useApiRequest";
import { ChatBox } from "./ChatBox";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

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

  const ChatParticpents = chatDetails?.data?.participants;

  const {
    data: fetchedMessages,
    loading: messagesLoading,
    error: messagesError,
  } = useFetch({
    endpoint: `/messages/${id}`,
  });

  const {
    loading: sendMessageLoading,
    error: sendMessageError,
    sendRequest: onSendMessage,
  } = useApiRequest();
  const {
    loading: adddEmojiiLoading,
    error: addEmojiiError,
    sendRequest: onAddEmojii,
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

  useEffect(() => {
    setAllMessages([...allMessages, ...socketMessages]);
  }, [JSON.stringify(socketMessages)]);

  const handleSendMessage = async ({ text, file, audio }) => {
    try {
      const DataSend = new FormData();
      DataSend.append("text", text);
      if (file) {
        DataSend.append("media", file);
      }
      if (audio) {
        DataSend.append("media", audio);
      }
      const response = await onSendMessage({
        url: `/messages/${id}`,
        body: DataSend,
        method: "post",
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });

      sendGroupMessage({
        roomId: id,
        payload: text,
        action: "message",
        media: file ? [file] : audio ? [audio] : [],
      });

      const newMessage = {
        _id: response?.data?._id || Date.now(),
        text: text,
        sender: {
          _id: user.data._id,
          profileImg: user.data.profileImg,
          username: user.data.username,
        },
        media: response?.media,
      };

      setAllMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleAddEmojii = async (emoji) => {
    try {
      const response = await onSendMessage({
        url: `/messages/676e0b02137264b8138430b1/reactions`,
        body: {
          emoji,
        },
        method: "post",
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
    } catch (err) {}
  };

  const FindUserById = (id) => {
    return ChatParticpents?.find((user) => {
      return user.userDetails._id === id;
    });
  };

  console.log(allMessages);

  return (
    <Stack p="3" borderRadius="lg" bgColor="white" w="100%">
      {chatDetailsLoading ? (
        <Skeleton h="100px" w="100%" />
      ) : (
        <ChatBox {...chatDetails?.data} />
      )}

      <Stack
        p="4"
        overflow="auto"
        h="100%"
        as={Skeleton}
        isLoaded={!messagesLoading}
      >
        {allMessages.map((message) => {
          const User = FindUserById(message?.sender?._id || message.senderId);
          const messageText = message?.text || message?.payload;
          return (
            <ChatMessage
              id={message._id}
              key={message._id}
              Sender={User}
              message={messageText}
              media={message.media}
              onSendEmojii={handleAddEmojii}
            />
          );
        })}
      </Stack>

      {FindUserById(user?.data?._id) ? (
        <ChatInput isLoading={sendMessageLoading} onSend={handleSendMessage} />
      ) : (
        <Text fontSize="lg" p="3" bgColor="gray.100">
          انت لست عضوا فهذا الشات
        </Text>
      )}
    </Stack>
  );
}
