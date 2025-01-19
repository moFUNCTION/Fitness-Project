import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  TableContainer,
  Skeleton,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdSearch } from "react-icons/md";
import { useFetch } from "../../../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Pagination } from "../../../../../../Components/Common/Pagination/Pagination";
import { useWatch } from "react-hook-form";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";
const BodyPartSelectModal = ({ isOpen, onClose, onSubmit, bodyPart }) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState(bodyPart);
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading } = useFetch({
    endpoint: "/bodyParts",
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  return (
    <Modal size="2xl" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>اختار العضو المستهدف</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedBodyPart && (
            <Heading size="sm" bgColor="gray.100" p="3" textAlign="center">
              العضو المختار : {selectedBodyPart?.title}
            </Heading>
          )}

          <TableContainer
            className="no-scroll-bar"
            as={Skeleton}
            minH="400px"
            isLoaded={!loading}
            overflow="auto"
            w="100%"
          >
            <Table size="lg">
              <Thead w="100%">
                <Tr>
                  <Th>العنوان</Th>
                  <Th>تم الانشاء بتوقيت</Th>
                  <Th>تم التحديث بتوقيت</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.data?.map((item) => {
                  const { _id, title, createdAt, updatedAt } = item;
                  return (
                    <Tr
                      bgColor={_id === selectedBodyPart?._id && "blue.100"}
                      onClick={() => setSelectedBodyPart(item)}
                      key={_id}
                      cursor="pointer"
                    >
                      <Td>{title}</Td>
                      <Td>{new Date(createdAt).toLocaleString()}</Td>
                      <Td>{new Date(updatedAt).toLocaleString()}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          <Pagination
            totalPages={data?.paginationResult?.numberOfPages}
            currentPage={page}
            onPageChange={(page) => setPage(page)}
          />
        </ModalBody>

        <ModalFooter gap="3">
          <Button colorScheme="red" onClick={onClose}>
            غلق
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              onSubmit(selectedBodyPart);
              onClose();
            }}
          >
            تأكيد
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const ExerciseBodyPart = ({ control, setValue, errors }) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const selectedBodyPart = useWatch({ control, name: "bodyPart" });

  return (
    <>
      <BodyPartSelectModal
        bodyPart={selectedBodyPart}
        onSubmit={(selectedBodyPart) => setValue("bodyPart", selectedBodyPart)}
        isOpen={isOpen}
        onClose={onClose}
      />
      {selectedBodyPart && (
        <Heading size="sm" bgColor="gray.100" p="3" textAlign="center">
          العضو المختار : {selectedBodyPart?.title}
        </Heading>
      )}
      <Button
        whiteSpace="wrap"
        p={{
          base: "10",
          md: "0",
        }}
        gap="4"
        onClick={onOpen}
        colorScheme="blue"
      >
        اضغط هنا لاختيار العضو المستهدف
        <MdSearch />
      </Button>
      <ErrorText>{errors?.bodyPart?.message}</ErrorText>
    </>
  );
};
