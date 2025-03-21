import { Flex, Skeleton, Stack, useMediaQuery } from "@chakra-ui/react";
import { Header } from "../../Components/Layout/Header/Header";
import { Outlet } from "react-router-dom";
import AccessDenied from "./AccessDenied/AccessDenied";
import { TabsMenuExpandProvider } from "../../Context/TabsMenuExpandProvider/TabsMenuExpandProvider";
import {
  MobileTabMenu,
  TabsMenu,
} from "../../Components/Layout/TabssMenu/TabsMenu";
import { useAuth } from "../../Context/UserDataContextProvider/UserDataContextProvder";
import { LazyPageWrapper } from "../../Components/Common/LazyPageWrapper/LazyPageWrapper";
export default function Index() {
  const { user } = useAuth();
  const [isPhoneQuery] = useMediaQuery("(max-width: 900px)");
  return (
    <TabsMenuExpandProvider>
      <Stack gap="0">
        <Header />

        <Flex
          sx={{
            " > div": {
              overflow: "auto",
              height: "100%",
            },
          }}
          h="calc(100vh - 113px)"
          as={Skeleton}
          isLoaded={!user.loading}
        >
          {isPhoneQuery ? <MobileTabMenu /> : <TabsMenu />}
          {user.data?.active === true ? (
            <LazyPageWrapper>
              <Outlet />
            </LazyPageWrapper>
          ) : (
            <AccessDenied message="الرجاء التوجه الي مشرفين المنصة لتفعيل حسابك" />
          )}
        </Flex>
      </Stack>
    </TabsMenuExpandProvider>
  );
}
