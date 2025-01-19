import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosInstance from "../../axiosConfig/axiosInstance";
import { useToast } from "@chakra-ui/react";

const UserDataContext = createContext();
export const UserDataContextProvder = ({ children }) => {
  const toast = useToast();
  const getUserDataFromLocalStorage = () => {
    const userData = localStorage.getItem("user-data");
    if (userData) {
      return {
        data: JSON.parse(userData),
        loading: false,
        error: null,
      };
    }
    return {
      data: null,
      loading: false,
      error: null,
    };
  };
  const [user, setUser] = useState(() => getUserDataFromLocalStorage());
  useEffect(() => {
    localStorage.setItem("user-data", JSON.stringify(user.data));
  }, [user.data]);

  const handleError = (message) => {
    toast({
      position: "top-right",
      title: "خطأ في طلب بيانات المستخدم",
      description: message,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    setUser((prevState) => ({ ...prevState, error: message }));
  };

  const onAuthenticate = (data) => {
    setUser({ data, loading: false, error: null });
    localStorage.setItem("token", data.token);
  };

  const onGetUserData = async () => {
    setUser((prevState) => ({ ...prevState, loading: true }));
    try {
      const authToken = localStorage.getItem("token");
      const res = await axiosInstance.get("/users/getMe", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = { ...res.data.data, token: authToken };
      setUser({
        data,
        loading: false,
        error: null,
      });
      return data;
    } catch (err) {
      handleError(err.message);
    } finally {
      setUser((prevState) => ({ ...prevState, loading: false }));
    }
  };
  const onLogout = () =>
    setUser({
      data: null,
      loading: false,
      error: null,
    });
  return (
    <UserDataContext.Provider
      value={{
        user,
        onAuthenticate,
        onGetUserData,
        onLogout,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useAuth = () => useContext(UserDataContext);
