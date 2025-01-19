import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { MdPhone } from "react-icons/md";
import { ErrorText } from "../../../../../Components/Common/ErrorText/ErrorText";

export const UserEmail = ({ register, errors }) => {
  return (
    <>
      <Input
        {...register("email")}
        placeholder="البريد الالكتروني"
        isInvalid={errors.email}
        _placeholder={{
          color: errors.email && "red.500",
        }}
      />
      <ErrorText ml="auto" mr="1">
        {errors.email?.message}
      </ErrorText>
    </>
  );
};
