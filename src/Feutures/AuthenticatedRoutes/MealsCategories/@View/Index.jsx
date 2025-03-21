import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Stack,
  Skeleton,
  Heading,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { MdQuiz } from "react-icons/md";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useForm } from "react-hook-form";
import { InputElement } from "../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiRequest } from "../../../../Hooks/useApiRequest/useApiRequest";
import { MealCategory } from "./Components/MealCategory/MealCategory";
import { ErrorText } from "../../../../Components/Common/ErrorText/ErrorText";
const schema = z.object({
  title_AR: z.string().min(1, { message: "الرجاء ادخال العنوان بالعربية  " }),
  title_EN: z
    .string()
    .min(1, { message: "الرجاء ادخال العنوان بالانجليزية  " }),
  targetModel: z.string().min(1, { message: "الرجاء ادخال الفئة المستهدفة" }),
  parentCategory: z.any(),
});
const AddmealsCategoryModal = ({
  onClose,
  isOpen,
  onRenderPage,
  ParentCategories,
}) => {
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { user } = useAuth();
  const { sendRequest: onCreateTool, loading, error } = useApiRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    try {
      await onCreateTool({
        url: `/mealsCategory`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: {
          title_AR: data.title_AR,
          title_EN: data.title_EN,
          ...data,
        },
        method: "post",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم انشاء الصنف  بنجاح",
        status: "success",
      });
      reset();
    } catch (err) {
      toast({
        title: "خطأ في انشاء الصنف ",
        description: err.message,
        status: "err",
      });
    }
  };
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>اضافة صنف من الوجبات </ModalHeader>
        <ModalCloseButton />
        <ModalBody gap="3" as={Stack}>
          <InputElement
            errors={errors}
            name="title_AR"
            register={register}
            placeholder="اسم الصنف بالعربية"
            Icon={CgGym}
          />

          <InputElement
            errors={errors}
            name="title_EN"
            register={register}
            placeholder="اسم الصنف بالانجليزية"
            Icon={CgGym}
          />
          <Select
            variant="filled"
            size="lg"
            placeholder="الفئة المستهدفة"
            {...register("targetModel")}
          >
            <option value="Meals">وجبات</option>
            <option value="MealsCalculation">وجبات محاسبة</option>
          </Select>

          <Select
            variant="filled"
            size="lg"
            placeholder="الصنف الاب"
            {...register("parentCategory")}
          >
            {ParentCategories?.map((item) => {
              return (
                <option key={item._id} value={item._id}>
                  {item?.title_AR || item?.Title_AR}
                </option>
              );
            })}
          </Select>

          <ErrorText>{errors?.targetModel?.message}</ErrorText>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" variant="outline" ml={3} onClick={onClose}>
            غلق
          </Button>
          <Button
            isLoading={isSubmitting}
            colorScheme="green"
            onClick={handleSubmit(onSubmit)}
          >
            اضافة
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function Index() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, HandleRender } = useFetch({
    endpoint: "/mealsCategory?isParent=true",
    params: {
      page,
      limit: 100000000,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  const {
    data: ChildCategories,
    loading: ChildCategorieslLoading,
    HandleRender: onRenderChildCategories,
  } = useFetch({
    endpoint: "/mealsCategory?isParent=false",
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <AddmealsCategoryModal
        onRenderPage={async () => {
          await HandleRender();
          await onRenderChildCategories();
        }}
        isOpen={isOpen}
        onClose={onClose}
        ParentCategories={data?.data}
      />
      <Stack w="100%" p="3">
        <HStack
          justifyContent="space-between"
          p="4"
          borderRadius="md"
          bgColor="gray.100"
          flexWrap="wrap"
          gap="5"
        >
          <Heading
            color="blue.800"
            display="flex"
            gap="3"
            alignItems="center"
            size="md"
          >
            اهلا بك في اصناف الوجبات
            <MdQuiz />
          </Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            اضافة صنف من الوجبات
          </Button>
        </HStack>
        <TableContainer
          as={Skeleton}
          minH="400px"
          isLoaded={!loading}
          overflow="auto"
          w="100%"
          flexShrink="0"
        >
          <Table size="lg">
            <Thead w="100%">
              <Tr>
                <Th>هل به اقسام</Th>
                <Th>العنوان</Th>
                <Th>العنوان بالانجليزية</Th>
                <Th>تم الانشاء بتوقيت</Th>
                <Th>تم التحديث بتوقيت</Th>
                <Th>التعديل</Th>
                <Th>الحذف</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data?.map((item) => {
                return (
                  <MealCategory
                    childCategries={ChildCategories?.data?.filter((child) => {
                      return child?.parentCategory?._id === item._id;
                    })}
                    onRenderPage={HandleRender}
                    key={item._id}
                    {...item}
                  />
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>

        <Pagination
          totalPages={data?.paginationResult?.numberOfPages}
          currentPage={page}
          onPageChange={(page) => setPage(page)}
          isLoading={loading}
        />
      </Stack>
    </>
  );
}
