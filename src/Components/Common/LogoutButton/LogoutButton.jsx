import { Button, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuth } from "../../../Context/UserDataContextProvider/UserDataContextProvder";
export const LogoutButton = ({ ...rest }) => {
  const { onLogout } = useAuth();
  return (
    <Button onClick={onLogout} colorScheme="red" {...rest}>
      تسجيل الخروج
    </Button>
  );
};
