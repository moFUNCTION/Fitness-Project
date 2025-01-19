import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { MdPhone } from "react-icons/md";
import { ErrorText } from "../../../../../Components/Common/ErrorText/ErrorText";

export const UserInformation = ({ register, errors }) => {
  return (
    <>
      <Input
        {...register("username")}
        placeholder="اسم المستخدم"
        isInvalid={errors.username}
        _placeholder={{
          color: errors.username && "red.500",
        }}
      />
      <ErrorText ml="auto" mr="1">
        {errors.username?.message}
      </ErrorText>
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
      <InputGroup>
        <Input
          isInvalid={errors.phoneNumber}
          _placeholder={{
            color: errors.phoneNumber && "red.500",
          }}
          {...register("phoneNumber")}
          placeholder="رقم الهاتف"
        />
        <InputRightAddon>
          <MdPhone />
        </InputRightAddon>
      </InputGroup>
      <ErrorText ml="auto" mr="1">
        {errors.phoneNumber?.message}
      </ErrorText>
    </>
  );
};
