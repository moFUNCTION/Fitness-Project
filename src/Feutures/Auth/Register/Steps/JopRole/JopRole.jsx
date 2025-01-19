import { Select } from "@chakra-ui/react";
import { ErrorText } from "../../../../../Components/Common/ErrorText/ErrorText";
export const JopRole = ({ register, errors }) => {
  return (
    <>
      <Select
        placeholder="الدور الوظيفي"
        isInvalid={errors.role}
        _placeholder={{
          color: errors.role && "red.500",
        }}
        {...register("role")}
      >
        <option value="Super-Admin">مشرف</option>
        <option value="Employer">مدير شركة</option>
        <option value="Accountant">محاسب</option>
      </Select>
      <ErrorText ml="auto" mr="1">
        {errors.role?.message}
      </ErrorText>
    </>
  );
};
