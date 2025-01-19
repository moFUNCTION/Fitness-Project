import React from "react";
import { InputElement } from "../../../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { Textarea } from "@chakra-ui/react";

export const PlanNameDescription = ({ register, errors }) => {
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
    </>
  );
};
