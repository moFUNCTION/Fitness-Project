import {
  Avatar,
  AvatarGroup,
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
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import React from "react";
import { useFetch } from "../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../Context/UserDataContextProvider/UserDataContextProvder";
import { LazyLoadedImage } from "../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { Link, Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { Pagination } from "../../../Components/Common/Pagination/Pagination";
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
        <Stack
          as={Link}
          to={_id}
          borderRadius="lg"
          flexShrink="0"
          w="100%"
          bgColor="gray.50"
          p="3"
          gap="5"
          _hover={{
            bgColor: "gray.100",
          }}
        >
          <Flex>
            <AvatarGroup size="sm" max={2}>
              {participants.map(({ user }) => {
                return (
                  <Avatar
                    key={user?.id}
                    name={user?.username}
                    src={user?.profileImg}
                  />
                );
              })}
            </AvatarGroup>
            <Button mr="auto" size="sm" colorScheme="green" borderRadius="full">
              شات مجموعة
            </Button>
            <Button
              mr="auto"
              size="sm"
              colorScheme="green"
              borderRadius="full"
              variant="outline"
              bgColor="white"
            >
              {new Date(createdAt).toLocaleString("ar-EG")}
            </Button>
          </Flex>

          <Flex gap="4" alignItems="start">
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
              <Text fontSize="sm">الوصف : {description}</Text>
              <Text fontSize="sm">الاعضاء : {participants.length}</Text>
            </Stack>
          </Flex>
        </Stack>
      </>
    );
  }
  const [UserChat] = participants?.filter(({ user: UserChat }) => {
    return UserChat?.email !== user.data?.email;
  });
  return (
    <>
      <Stack
        borderRadius="lg"
        flexShrink="0"
        w="100%"
        bgColor="gray.50"
        p="3"
        gap="5"
        _hover={{
          bgColor: "gray.100",
        }}
        as={Link}
        to={_id}
      >
        <Flex gap="4" alignItems="center">
          <Avatar
            src={UserChat?.user?.profileImg}
            name={UserChat?.user?.username}
          />
          <Stack gap="1" w="100%" maxW="200px">
            <Text>العنوان : {UserChat.user?.username}</Text>
            <Text fontSize="sm">الايميل : {UserChat.user?.email}</Text>
          </Stack>
        </Flex>
      </Stack>
    </>
  );
};
const ChatsSlider = ({ isLoading, Chats, isPhoneQyery }) => {
  return (
    <Stack
      as={Skeleton}
      isLoaded={!isLoading}
      borderRadius="lg"
      bgColor="white"
      w="100%"
      maxW={!isPhoneQyery && "400px"}
      p="3"
      overflow="auto"
    >
      <Menu>
        <MenuButton as={Button} flexShrink="0" mr="auto">
          <IoMdAdd />
        </MenuButton>

        <MenuList>
          <MenuItem as={Link} to={`/chat/add/group`}>
            انشاء شات مجموعة
          </MenuItem>
          <MenuItem>انشاء شات فردي </MenuItem>
        </MenuList>
      </Menu>

      {Chats &&
        Chats?.data?.map((chat) => {
          return (
            <>
              <ChatBox {...chat} key={chat.id} />
            </>
          );
        })}
    </Stack>
  );
};

export default function Index() {
  const [isPhoneQyery] = useMediaQuery("(max-width: 1200px)");
  const { user } = useAuth();
  console.log(user);
  const {
    data: Chats,
    loading: ChatsLoading,
    error: ChatsError,
  } = useFetch({
    endpoint: "/chats",
    params: {
      limit: 30,
    },
  });
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex gap="4" bgColor="blue.600" p="3" w="100%">
      {isPhoneQyery && (
        <IconButton onClick={onOpen}>
          <FaBars />
        </IconButton>
      )}

      {isPhoneQyery ? (
        <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>المحادثات</DrawerHeader>

            <DrawerBody>
              <ChatsSlider
                isPhoneQyery={isPhoneQyery}
                isLoading={ChatsLoading}
                Chats={Chats}
              />
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" ml={3} onClick={onClose}>
                غلق
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <ChatsSlider isLoading={ChatsLoading} Chats={Chats} />
      )}

      <Outlet />
    </Flex>
  );
}
