import {
  Avatar,
  AvatarGroup,
  Button,
  Divider,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { useAuth } from "../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { LazyLoadedImage } from "../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { Text } from "@chakra-ui/react";
export const ChatBox = ({
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
