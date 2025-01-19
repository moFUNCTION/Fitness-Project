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
  Flex,
  Badge,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdSearch } from "react-icons/md";
import { useFetch } from "../../../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Pagination } from "../../../../../../Components/Common/Pagination/Pagination";
import { useFieldArray } from "react-hook-form";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";
const DeepAnatomySelectModal = ({
  isOpen,
  onClose,
  onSubmit,
  deepAnatomies,
}) => {
  const [selectedDeepAnatomies, setSelectedDeepAnatomies] =
    useState(deepAnatomies);
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading } = useFetch({
    endpoint: "/deepAnatomy",
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  const HandleRemoveItem = (id) => {
    setSelectedDeepAnatomies(
      selectedDeepAnatomies.filter((child) => {
        return child._id !== id;
      })
    );
  };
  const HandleAddItem = (item) => {
    setSelectedDeepAnatomies((prev) => {
      return [...prev, item];
    });
  };

  return (
    <Modal size="3xl" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>اختار التشريح العميق المستهدف</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap="4" mb="3" alignItems="center">
            <Heading flexShrink="0" size="sm" p="3" textAlign="center">
              التشريح العميق المختار
            </Heading>
            <Flex overflow="hidden" flexWrap="wrap" gap="3">
              {selectedDeepAnatomies &&
                selectedDeepAnatomies?.map((selectedDeepAnatomy) => {
                  return (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      key={selectedDeepAnatomy?._id}
                      className="show-up-animation"
                      onClick={() => HandleRemoveItem(selectedDeepAnatomy._id)}
                    >
                      {selectedDeepAnatomy?.title}
                    </Button>
                  );
                })}
            </Flex>
          </Flex>

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
                </Tr>
              </Thead>
              <Tbody>
                {data?.data?.map((item) => {
                  const { _id, title } = item;
                  const selectedDeepAnatomy = selectedDeepAnatomies.find(
                    (selectedDeepAnatomy) => {
                      return selectedDeepAnatomy._id === _id;
                    }
                  );
                  return (
                    <Tr
                      transition="0.3s"
                      bgColor={selectedDeepAnatomy && "gray.100"}
                      onClick={() => {
                        if (selectedDeepAnatomy) {
                          HandleRemoveItem(_id);
                        } else {
                          HandleAddItem(item);
                        }
                      }}
                      key={_id}
                      cursor="pointer"
                    >
                      <Td>{title}</Td>
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
              onSubmit(selectedDeepAnatomies);
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

export const ExerciseDeepAnatomy = ({ control, setValue, errors }) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { fields: selectedDeepAnatomies, replace } = useFieldArray({
    control,
    name: "deepAnatomy",
  });
  const HandleRemoveItem = (id) => {
    replace(
      selectedDeepAnatomies.filter((child) => {
        return child._id !== id;
      })
    );
  };

  return (
    <>
      <DeepAnatomySelectModal
        deepAnatomies={selectedDeepAnatomies}
        onSubmit={(items) => replace(items)}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Flex flexWrap="wrap" gap="4" mb="3" alignItems="center">
        <Heading flexShrink="0" size="sm" p="3" textAlign="center">
          التشريح العميق المختار
        </Heading>
        <Flex overflow="hidden" flexWrap="wrap" gap="3">
          {selectedDeepAnatomies &&
            selectedDeepAnatomies?.map((selectedDeepAnatomy) => {
              return (
                <Button
                  size="sm"
                  colorScheme="blue"
                  key={selectedDeepAnatomy?._id}
                  className="show-up-animation"
                  onClick={() => HandleRemoveItem(selectedDeepAnatomy._id)}
                >
                  {selectedDeepAnatomy?.title}
                </Button>
              );
            })}
        </Flex>
      </Flex>
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
        اضغط هنا لاختيار التشريح العميق المستهدف
        <MdSearch
          style={{
            flexShrink: 0,
          }}
        />
      </Button>
      <ErrorText>{errors?.deepAnatomy?.message}</ErrorText>
    </>
  );
};
