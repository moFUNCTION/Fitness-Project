import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Text,
  Stack,
  Heading,
  Divider,
  Flex,
  Button,
} from "@chakra-ui/react";
import { DeleteModal } from "../../../../../Components/Common/DeleteModal/DeleteModal";
import { useApiRequest } from "../../../../../Hooks/useApiRequest/useApiRequest";
import { Link } from "react-router-dom";
import { LazyLoadedImage } from "../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
export const SupplementCard = ({ supplement }) => {
  const { loading, sendRequest: onDeleteItem, error } = useApiRequest();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <>
      <DeleteModal />
      <Card
        boxShadow="sm"
        maxW="md"
        w="100%"
        border="1px"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
        transition="0.3s"
        _hover={{
          boxShadow: "lg",
        }}
      >
        <CardHeader>
          <Stack spacing={2}>
            <Heading size="md">{supplement.title}</Heading>
            <Text color="gray.500" fontSize="sm">
              {supplement.description}
            </Text>
          </Stack>
        </CardHeader>

        <CardBody>
          <Stack w="100%" spacing={4}>
            <LazyLoadedImage
              src={supplement.image}
              alt={supplement.title}
              ImageProps={{
                objectFit: "cover",
              }}
              borderRadius="lg"
              h="300px"
              w="100%"
            />
            <Text py={2}>{supplement.description}</Text>
          </Stack>
          <Divider />
          <Stack spacing={2} width="100%">
            <Box display="flex" justifyContent="space-between">
              <Text fontSize="sm" color="gray.500">
                تاريخ الإنشاء:
              </Text>
              <Text fontSize="sm" color="gray.500">
                {formatDate(supplement.createdAt)}
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text fontSize="sm" color="gray.500">
                تاريخ التحديث:
              </Text>
              <Text fontSize="sm" color="gray.500">
                {formatDate(supplement.updatedAt)}
              </Text>
            </Box>
          </Stack>
        </CardBody>

        <Divider />

        <CardFooter gap="3">
          <Button as={Link} to={supplement._id} colorScheme="blue">
            عرض كل التفاصيل
          </Button>
          <Button colorScheme="green" as={Link} to={`${supplement._id}/Update`}>
            تعديل{" "}
          </Button>
          <Button colorScheme="red"> حذف </Button>
        </CardFooter>
      </Card>
    </>
  );
};
