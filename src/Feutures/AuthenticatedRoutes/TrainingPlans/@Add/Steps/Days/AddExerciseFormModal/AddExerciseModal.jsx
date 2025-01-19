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
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { GoPackage } from "react-icons/go";
import { SearchExerciseModal } from "../SearchExerciseModal/SearchExerciseModal";
import { InputElement } from "../../../../../../../Components/Common/InputElement/InputElement";
import { IoMdTime } from "react-icons/io";
import { PiArrowCounterClockwiseFill } from "react-icons/pi";
import { useOveride } from "../../../../../../../Hooks/useOveride/useOveride";
import { LazyLoadedImage } from "../../../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseSchema } from "../../../schema";
import { ErrorText } from "../../../../../../../Components/Common/ErrorText/ErrorText";
const ExerciseField = ({ label, value, size = "xs" }) => (
  <Flex gap="4" alignItems="center">
    <Button colorScheme="blue" variant="outline" bgColor="white" size={size}>
      {label}
    </Button>
    <Text fontSize={size}>{value || "غير محدد"}</Text>
  </Flex>
);

const ExerciseCard = ({ exercise }) => {
  return (
    <Flex
      gap="4"
      borderRadius="lg"
      bgColor={"green.100"}
      p="3"
      w="100%"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
      pos="relative"
      flexWrap="wrap"
    >
      <LazyLoadedImage
        src={exercise.video.thumbnail}
        w="80px"
        h="auto"
        ImageProps={{
          objectFit: "cover",
        }}
        borderRadius="lg"
      />
      <Stack spacing={3}>
        <ExerciseField label="الاسم" value={exercise.title} />
        <ExerciseField label="الوصف" value={exercise.Description} />
        <ExerciseField label="العضو" value={exercise.bodyPart?.title} />
      </Stack>
    </Flex>
  );
};

export const AddExerciseModal = ({
  onClose,
  isOpen,
  role = "Add",
  submitHandler,
  defaultValues,
}) => {
  const {
    isOpen: isOpenedSearchExerciseModal,
    onOpen: onOpenSearchExerciseModal,
    onClose: onCloseSearchExerciseModal,
  } = useDisclosure();
  useOveride();

  const {
    register,
    formState: { errors },
    setValue,
    control,
    handleSubmit,
    setError,
  } = useForm({
    resolver: zodResolver(exerciseSchema),
    mode: "onBlur",
    defaultValues,
  });
  const HandleChooseExercise = (exercise) => {
    setValue("exercise", exercise);
    onCloseSearchExerciseModal();
  };
  const exercise = useWatch({
    control,
    name: "exercise",
  });
  const onSubmit = (data) => {
    if (!data.exercise) {
      setError("exercise", "الرجاء اختيار التمرين");
      return;
    }
    submitHandler(data);
  };
  return (
    <>
      <SearchExerciseModal
        isOpen={isOpenedSearchExerciseModal}
        onClose={onCloseSearchExerciseModal}
        onSubmit={HandleChooseExercise}
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
          <ModalHeader>اضافة التمرينة</ModalHeader>
          <ModalCloseButton />
          <ModalBody as={Stack} gap="4">
            <InputElement
              register={register}
              name="sets"
              placeholder="عدد المجاميع"
              type="number"
              Icon={PiArrowCounterClockwiseFill}
              errors={errors}
            />
            <InputElement
              register={register}
              name="reps"
              placeholder="عدد العدات"
              type="number"
              Icon={PiArrowCounterClockwiseFill}
              errors={errors}
            />
            <InputElement
              register={register}
              errors={errors}
              name="restBetweenSets"
              placeholder="مقدار الراحة بين المجاميع"
              type="number"
              Icon={IoMdTime}
            />
            <InputElement
              register={register}
              errors={errors}
              name="restBetweenExercises"
              type="number"
              Icon={IoMdTime}
              placeholder="مقدار الراحة بين العدات"
            />
            <Button colorScheme="blue" onClick={onOpenSearchExerciseModal}>
              {exercise
                ? `تم اختيار التمرين : ${exercise.title}`
                : "اضغط هنا لأختيار التمرين"}
            </Button>
            <ErrorText>{errors?.exercise?.message}</ErrorText>
          </ModalBody>
          <ModalFooter gap="3">
            <Button colorScheme="red" onClick={onClose}>
              غلق
            </Button>
            <Button onClick={handleSubmit(onSubmit)} colorScheme="blue">
              {role === "Add" ? "اضافة " : "تحديث "}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
