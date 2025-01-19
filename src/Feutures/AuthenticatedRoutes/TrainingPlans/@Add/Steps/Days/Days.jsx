import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { AddDayModal } from "./AddDaysFormModal/AddDayModal";
import { useFieldArray } from "react-hook-form";
import { numberToOrdinal } from "../../../../../../Utils/NumberToOrdinal/NumberToOrdinal";
import { GoPackage } from "react-icons/go";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";

const Day = ({ index, exercises, onUpdate, onDelete, title }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <AddDayModal
        defaultValues={{
          exercises,
        }}
        isOpen={isOpen}
        onClose={onClose}
        role="Update"
        submitHandler={onUpdate}
      />
      <Stack gap="5" borderRadius="lg" bgColor="white" p="3">
        <Heading gap="3" display="flex" alignItems="center" size="sm">
          اليوم {numberToOrdinal(index + 1)}
          {title && <span>{`(${title})`}</span>}
          <GoPackage />
        </Heading>
        <Flex gap="3">
          <Button>عدد التمارين : {exercises?.length}</Button>
          <Button onClick={onOpen} colorScheme="blue">
            مشاهدة
          </Button>
          <Button onClick={onOpen} colorScheme="blue" variant="outline">
            تحديث
          </Button>
          <Button onClick={onDelete} colorScheme="red" variant="outline">
            حذف
          </Button>
        </Flex>
      </Stack>
    </>
  );
};

export const Days = ({ control, errors }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "days",
  });

  const HandleAddDayModal = (data) => {
    append({
      value: data,
    });
  };
  const HandleDeleteDay = (index) => {
    remove(index);
  };
  const HandleUpdateDay = (index, data) => {
    update(index, {
      value: data,
    });
  };
  return (
    <>
      <AddDayModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        submitHandler={HandleAddDayModal}
        key={isOpen}
      />
      <ErrorText>{errors?.days?.message}</ErrorText>
      <Stack borderRadius="lg" p="3" bgColor="gray.100">
        {fields.map((item, index) => {
          return (
            <Day
              onDelete={() => HandleDeleteDay(index)}
              onUpdate={(data) => HandleUpdateDay(index, data)}
              key={item.id}
              {...item.value}
              index={index}
            />
          );
        })}
        <Button
          mt="auto"
          mr="auto"
          w="fit-content"
          onClick={onOpen}
          colorScheme="blue"
        >
          اضافة يوم
        </Button>
      </Stack>
    </>
  );
};
