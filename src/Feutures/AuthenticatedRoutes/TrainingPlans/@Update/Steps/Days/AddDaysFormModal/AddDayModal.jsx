import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GoPackage } from "react-icons/go";
import { AddExerciseModal } from "../AddExerciseFormModal/AddExerciseModal";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPlanSchema } from "../../../schema";
import { LazyLoadedImage } from "../../../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { InputElement } from "../../../../../../../Components/Common/InputElement/InputElement";
const ExerciseField = ({ label, value, size = "xs" }) => (
  <Flex gap="4" alignItems="center">
    <Button colorScheme="blue" variant="outline" bgColor="white" size={size}>
      {label}
    </Button>
    <Text fontSize={size}>{value || "غير محدد"}</Text>
  </Flex>
);

const ExerciseCard = ({ data, onDelete, onUpdate }) => {
  const { exercise } = data;
  const {
    isOpen: isOpenedUpdateModal,
    onOpen: onOpenUpdateModal,
    onClose: onCloseUpdateModal,
  } = useDisclosure();
  return (
    <>
      <AddExerciseModal
        isOpen={isOpenedUpdateModal}
        onClose={onCloseUpdateModal}
        role="Update"
        defaultValues={data}
        submitHandler={onUpdate}
      />
      <Flex
        gap="4"
        borderRadius="lg"
        bgColor="white"
        p="3"
        w="100%"
        transition="all 0.2s"
        _hover={{ transform: "translateY(-2px)", shadow: "md" }}
        pos="relative"
        flexWrap="wrap"
      >
        <LazyLoadedImage
          src={exercise.video.thumbnail}
          w="100px"
          flexGrow="1"
          h="auto"
          ImageProps={{
            objectFit: "cover",
          }}
          borderRadius="lg"
        />
        <Stack spacing={3}>
          <ExerciseField label="الاسم" value={exercise.title} />
          <ExerciseField label="عدد المجاميع" value={data.sets} />
          <ExerciseField label="العدات" value={data.reps} />
          <ExerciseField
            label="مقدار الراحة بين المجاميع"
            value={data.restBetweenSets}
          />
          <ExerciseField
            label="مقدار الراحة بين العدات"
            value={data.restBetweenExercises}
          />
        </Stack>
        <Flex gap="3" mr="auto" mt="auto">
          <Button onClick={onOpenUpdateModal} colorScheme="green">
            تعديل
          </Button>
          <Button onClick={onDelete} colorScheme="red">
            حذف
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export const AddDayModal = ({
  onClose,
  isOpen,
  role = "Add",
  submitHandler,
  defaultValues,
}) => {
  console.log(defaultValues);
  const {
    isOpen: isOpenedAddExerciseModal,
    onOpen: onOpenExerciseModal,
    onClose: onCloseExerciseModal,
  } = useDisclosure();
  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
    register,
  } = useForm({
    resolver: zodResolver(DayPlanSchema),
    defaultValues,
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "exercises",
  });

  console.log("asassff", fields);
  const HandleAddExercise = (data) => {
    append({
      value: data,
    });
    onCloseExerciseModal();
  };
  const HandleDelete = (index) => {
    remove(index);
  };
  const HandleUpdate = (index, data) => {
    update(index, {
      value: data,
    });
  };
  const onSubmit = (data) => {
    submitHandler(data);
    reset();
    onClose();
  };
  return (
    <>
      <AddExerciseModal
        isOpen={isOpenedAddExerciseModal}
        onClose={onCloseExerciseModal}
        submitHandler={HandleAddExercise}
        key={isOpenedAddExerciseModal}
      />
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{role === "Add" ? "اضافة" : "تحديث"} يوم </ModalHeader>
          <ModalCloseButton />
          <ModalBody as={Stack} gap="4">
            <Heading display="flex" gap="4" alignItems="center" size="md">
              <GoPackage />
              التمارين
            </Heading>

            <Stack
              maxH="60vh"
              overflow="auto"
              gap="4"
              borderRadius="lg"
              p="3"
              bgColor="gray.100"
            >
              {fields.map((item, index) => {
                return (
                  <ExerciseCard
                    onDelete={() => HandleDelete(index)}
                    onUpdate={(data) => HandleUpdate(index, data)}
                    data={item.value}
                    key={item.id}
                  />
                );
              })}
              <Button
                onClick={onOpenExerciseModal}
                colorScheme="blue"
                mr="auto"
                flexShrink="0"
              >
                اضافة تمرين
              </Button>
            </Stack>
          </ModalBody>
          <ModalFooter gap="3">
            <Button colorScheme="red" onClick={onClose}>
              غلق
            </Button>
            <Button onClick={handleSubmit(onSubmit)} colorScheme="blue">
              {role === "Add" ? "اضافة اليوم" : "تحديث اليوم"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
