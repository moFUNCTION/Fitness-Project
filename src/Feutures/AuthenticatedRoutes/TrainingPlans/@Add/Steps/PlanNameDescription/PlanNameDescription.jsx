import React from "react";
import { InputElement } from "../../../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { Flex, RadioGroup, Textarea, Text, Radio } from "@chakra-ui/react";
import { useWatch } from "react-hook-form";

export const PlanNameDescription = ({
  register,
  errors,
  setValue,
  control,
}) => {
  const targetGender = useWatch({ control, name: "targetGender" });

  return (
    <>
      <InputElement
        register={register}
        name="title"
        placeholder="العنوان"
        Icon={CgGym}
        errors={errors}
      />
      <InputElement
        noIcon
        register={register}
        name="description"
        placeholder="الوصف"
        Icon={CgGym}
        as={Textarea}
        errors={errors}
      />
      <RadioGroup
        value={targetGender}
        onChange={(value) => setValue("targetGender", value)}
      >
        <Flex justifyContent="space-around" bgColor="gray.50" p="3">
          <Text>الجنس المستهدف</Text>
          <Flex gap="6">
            <Radio value="men">الرجال</Radio>
            <Radio value="women">النساء</Radio>
          </Flex>
        </Flex>
      </RadioGroup>
    </>
  );
};
