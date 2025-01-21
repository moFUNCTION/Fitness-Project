import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Text,
  SimpleGrid,
  Badge,
  Container,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdDelete, MdEdit, MdOutlineSportsGymnastics } from "react-icons/md";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { GoPackage } from "react-icons/go";
import { BsCalendarWeek, BsEye } from "react-icons/bs";
import { LazyLoadedImage } from "../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { DeleteModal } from "../../../../Components/Common/DeleteModal/DeleteModal";
import { useApiRequest } from "../../../../Hooks/useApiRequest/useApiRequest";
const TrainingPlanCard = ({ plan, HandleRender }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { user } = useAuth();
  const { loading, error, sendRequest } = useApiRequest();
  const HandleDelete = () => {
    sendRequest({
      url: `trainingPlan/${plan._id}/moveToTrash`,
      method: "delete",
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    HandleRender();
  };
  const {
    isOpen: isOpenedDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  return (
    <>
      <DeleteModal
        onClose={onCloseDeleteModal}
        isOpen={isOpenedDeleteModal}
        isLoading={loading}
        onDelete={HandleDelete}
      />
      <Stack
        p={6}
        bg={bgColor}
        boxShadow="sm"
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        spacing={4}
        transition="all 0.2s"
        _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
      >
        <Flex justify="space-between" align="center">
          <HStack>
            <BsCalendarWeek />
            <Badge colorScheme="blue" variant="subtle" fontSize="sm">
              {plan.days.length} يوم
            </Badge>
          </HStack>
          <IconButton
            icon={<GoPackage />}
            variant="ghost"
            colorScheme="blue"
            size="sm"
            aria-label="تفاصيل الباقة"
          />
        </Flex>
        <LazyLoadedImage
          ImageProps={{
            objectFit: "cover",
          }}
          w="100%"
          h="200px"
          src={plan.image}
        />
        <Stack spacing={3}>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              الاسم
            </Text>
            <Heading size="sm" fontWeight="semibold">
              {plan.name || plan.title}
            </Heading>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
              الوصف
            </Text>
            <Text fontSize="sm" noOfLines={2}>
              {plan.description}
            </Text>
          </Box>
        </Stack>
        <Flex gap="3">
          <Button
            rightIcon={<BsEye />}
            colorScheme="blue"
            size="md"
            as={Link}
            to={plan._id}
          >
            عرض التفاصيل
          </Button>
          <Button
            as={Link}
            to={`${plan._id}/update`}
            gap="3"
            colorScheme="green"
          >
            تحديث
            <MdEdit />
          </Button>
          <Button onClick={onOpenDeleteModal} colorScheme="red" gap="3">
            حذف
            <MdDelete />
          </Button>
        </Flex>
      </Stack>
    </>
  );
};

const LoadingSkeleton = () => (
  <Stack
    p={6}
    boxShadow="sm"
    borderRadius="lg"
    border="1px"
    borderColor="gray.200"
    spacing={4}
    dir="rtl"
  >
    <Flex justify="space-between" align="center">
      <Skeleton height="20px" width="80px" />
      <Skeleton height="32px" width="32px" borderRadius="md" />
    </Flex>

    <Stack spacing={3}>
      <Box>
        <Skeleton height="14px" width="60px" mb={2} />
        <Skeleton height="20px" width="140px" />
      </Box>

      <Box>
        <Skeleton height="14px" width="80px" mb={2} />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="80%" mt={1} />
      </Box>
    </Stack>

    <Skeleton height="40px" width="100%" mt={2} />
  </Stack>
);

export default function Index() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const bgColor = useColorModeValue("gray.50", "gray.700");

  const { data, loading, HandleRender } = useFetch({
    endpoint: "/trainingPlan",
    params: { page },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  console.log(data);

  return (
    <Container maxW="container" py={6} dir="rtl">
      <Stack spacing={6}>
        <Flex
          justify="space-between"
          align="center"
          bg={bgColor}
          p={6}
          borderRadius="lg"
          flexWrap={{ base: "wrap", md: "nowrap" }}
          gap={4}
        >
          <HStack spacing={3}>
            <MdOutlineSportsGymnastics size="24px" />
            <Heading size="md">خطط التمارين</Heading>
          </HStack>
          <Button
            as={Link}
            colorScheme="blue"
            rightIcon={<GoPackage />}
            size="md"
            to="add"
          >
            إضافة باقة
          </Button>
        </Flex>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={6}
          minH="400px"
          alignItems="center"
        >
          {loading
            ? Array(3)
                .fill(0)
                .map((_, index) => <LoadingSkeleton key={index} />)
            : data?.data?.map((plan) => (
                <TrainingPlanCard
                  HandleRender={HandleRender}
                  key={plan._id}
                  plan={plan}
                />
              ))}
        </SimpleGrid>

        <Box>
          <Pagination
            totalPages={data?.paginationResult?.numberOfPages}
            currentPage={page}
            onPageChange={(page) => setPage(page)}
            isLoading={loading}
          />
        </Box>
      </Stack>
    </Container>
  );
}
