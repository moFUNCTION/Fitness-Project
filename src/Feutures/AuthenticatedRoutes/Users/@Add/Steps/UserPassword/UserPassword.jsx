import { PasswordInput } from "../../../../../../Components/Common/PasswordInput/PasswordInput";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";
export const UserPassword = ({ register, errors }) => {
  return (
    <>
      <PasswordInput
        placeholder="الرقم السري"
        {...register("password")}
        isInvalid={errors.password}
      />
      <ErrorText ml="auto" mr="1">
        {errors.password?.message}
      </ErrorText>
      <PasswordInput
        placeholder="تأكيد الرقم السري"
        {...register("confirmPassword")}
        isInvalid={errors.confirmPassword}
      />
      <ErrorText ml="auto" mr="1">
        {errors.confirmPassword?.message}
      </ErrorText>
    </>
  );
};
