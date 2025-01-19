import React from "react";
import { InputElement } from "../../../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { Textarea } from "@chakra-ui/react";
export const ExerciseInstructions = ({ register, errors }) => {
  return (
    <InputElement
      register={register}
      name="instructions"
      placeholder="خطوات التمرين"
      Icon={CgGym}
      as={Textarea}
      errors={errors}
    />
  );
};
