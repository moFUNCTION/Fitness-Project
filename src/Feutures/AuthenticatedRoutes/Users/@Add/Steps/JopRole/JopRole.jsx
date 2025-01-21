import { Select } from "@chakra-ui/react";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";
const roles = ["admin", "sub-admin", "Ls-trainer", "trainer", "user"];
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
        {roles.map((role) => {
          return (
            <option key={role} value={role}>
              {role}
            </option>
          );
        })}
      </Select>
      <ErrorText ml="auto" mr="1">
        {errors.role?.message}
      </ErrorText>
    </>
  );
};
