import React from "react";
import { InputElement } from "../../../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { Stack, Textarea } from "@chakra-ui/react";
import { RichTextEditor } from "../../../../../../Components/Common/RichTextEditor/RichTextEditor";

export const ExerciseTitleAndDescription = ({ register, errors }) => {
  return (
    <>
      <InputElement
        register={register}
        name="title"
        placeholder="عنوان التمرينة"
        Icon={CgGym}
        errors={errors}
      />
      <InputElement
        register={register}
        name="description"
        placeholder="وصف التمرينة"
        Icon={CgGym}
        as={Textarea}
        errors={errors}
      />
    </>
  );
};
