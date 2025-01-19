import {
  Button,
  HStack,
  IconButton,
  Skeleton,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { Logo } from "../../Common/Logo/Logo";
import { FaBars } from "react-icons/fa";
import { useNavigateHandler } from "../../../Hooks/useNavigateHandler/useNavigateHandler";
import { UserAvatar } from "../../Common/UserAvatar/UserAvatar";
import { BiChat } from "react-icons/bi";
import { useTabsMenuStatus } from "../../../Context/TabsMenuExpandProvider/TabsMenuExpandProvider";
import { useAuth } from "../../../Context/UserDataContextProvider/UserDataContextProvder";
import { IoReload } from "react-icons/io5";
export const Header = () => {
  const [isPhoneQuery] = useMediaQuery("(max-width: 1000px)");
  const { onNavigate, isPending } = useNavigateHandler();
  const { user, onGetUserData } = useAuth();
  const { onToggle: onToggleTabsMenu } = useTabsMenuStatus();

  return (
    <>
      <HStack
        justifyContent="space-between"
        borderBottom="1px"
        borderBottomColor="gray.100"
        p="3"
        pos="sticky"
        top="0"
        w="100%"
        zIndex="100"
        transition="0.3s"
        bgColor="white"
        flexWrap="wrap"
      >
        <HStack gap="7">
          <IconButton
            onClick={onToggleTabsMenu}
            borderRadius="full"
            colorScheme="blue"
          >
            <FaBars />
          </IconButton>
          <Logo redirectToMain={true} w="100px" />
        </HStack>

        <HStack as={Skeleton} fadeDuration={2} isLoaded={!user.loading} gap="3">
          {!isPhoneQuery && (
            <>
              {user.data ? (
                <>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    borderRadius="full"
                    gap="3"
                  >
                    {user.data.role}
                  </Button>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    borderRadius="full"
                    gap="3"
                  >
                    اهلا {user.data.firstName}
                  </Button>
                  <Button
                    onClick={onGetUserData}
                    colorScheme="blue"
                    borderRadius="full"
                  >
                    تحديث بيانات المستخدم
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => onNavigate("/login")}
                    isLoading={isPending}
                    colorScheme="blue"
                    borderRadius="full"
                  >
                    تسجيل دخول
                  </Button>
                  <Button
                    onClick={() => onNavigate("/register")}
                    isLoading={isPending}
                    variant="outline"
                    colorScheme="blue"
                    borderRadius="full"
                  >
                    انشاء حساب
                  </Button>
                </>
              )}
            </>
          )}
          {isPhoneQuery && (
            <IconButton
              colorScheme="blue"
              borderRadius="full"
              onClick={onGetUserData}
            >
              <IoReload />
            </IconButton>
          )}

          <UserAvatar
            isAuthenticated={user.data}
            profilePhoto={user.data?.profileImg}
            email={user.data?.email}
            phoneNumber={user.data?.phone}
          />
        </HStack>
      </HStack>
    </>
  );
};
