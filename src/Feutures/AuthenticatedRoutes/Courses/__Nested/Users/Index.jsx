import React, { useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Avatar,
  Skeleton,
  Flex,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useFetch } from "../../../../../Hooks/useFetch/useFetch";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../../Context/UserDataContextProvider/UserDataContextProvder";

export default function Index() {
  const { user } = useAuth();
  const toast = useToast({
    position: "top-right",
  });
  const { courseId } = useParams();
  const { data, loading, error, HandleRender } = useFetch({
    endpoint: `courses/${courseId}/courseUsers`,
  });
  const emailRef = useRef();
  const HandleAddUserToCourse = async () => {
    console.log(emailRef.current.value);
    try {
      await axiosInstance.post(
        `/courses/${courseId}/addUserToCourse`,
        {
          email: emailRef.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      toast({
        status: "success",
        title: "تم اضافة المستخدم بنجاح",
      });
      HandleRender();
      emailRef.current.value = "";
    } catch (err) {
      toast({
        title: "خطأ في اضافة المستخدم",
        description: err.message,
        status: "error",
      });
    }
  };
  return (
    <>
      <Flex gap="3">
        <Input ref={emailRef} placeholder="ايميل المستخدم" />
        <Button onClick={HandleAddUserToCourse} colorScheme="blue">
          اضافة
        </Button>
      </Flex>
      <TableContainer as={Skeleton} isLoaded={!loading} minH="400px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>الصورة</Th>
              <Th>ايميل</Th>
              <Th>رقم الهاتف</Th>
              <Th>الاسم</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.users?.map((user) => {
              return (
                <Tr key={user.email}>
                  <Td>
                    <Avatar src={user.profileImg} name={user?.username} />
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phone}</Td>
                  <Td>{user.username}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
