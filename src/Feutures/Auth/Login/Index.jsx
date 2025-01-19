import React from "react";
import { FormWrapper } from "../FormWrapper/FormWrapper";
import { Button, Flex, Heading, Stack, useToast } from "@chakra-ui/react";
import { ProgressBar } from "../../../Components/Common/ProgressBar/ProgressBar";
import { useMultipleFormSteps } from "../../../Hooks/useMultipleFormSteps/useMultipleFormSteps";
import { schema } from "./schema";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { UserEmail } from "./Steps/UserEmail/UserEmail";
import { UserPassword } from "./Steps/UserPassword/UserPassword";
import { Link } from "react-router-dom";
import axiosInstance from "../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Logo } from "../../../Components/Common/Logo/Logo";
const ErrorWrapper = {
  "Incorrect email or password":
    "بيانات خاطئة تأكد ان الرقم السري او البريد الالكتروني تم كتبتهم بشكل صحيح",
};
export default function Index() {
  const { onAuthenticate, user } = useAuth();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
    containerStyle: {
      maxW: "300px",
    },
  });
  const {
    formState: { errors, isSubmitting, isValidating, isLoading },
    register,
    HandleNext,
    HandlePrev,
    isLastStep,
    isFirstStep,
    // handleSubmit,
    CurrentStep,
    currentStepIndex,
    control,
    setValue,
    wrapperTransionStyles,
    handleSubmit,
  } = useMultipleFormSteps({
    steps: [
      {
        Component: UserEmail,
        fieldsRequired: ["email"],
      },
      {
        Component: UserPassword,
        fieldsRequired: ["password"],
      },
    ],
    schema: schema,
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    try {
      const req = await axiosInstance.post(`/auth/login`, data);
      toast({
        status: "success",
        title: "تم التسجيل للحساب بنجاح",
      });
      onAuthenticate({ ...req.data.data, token: req.data.token });
    } catch (err) {
      toast({
        status: "error",
        title: "خطأ",
        description: ErrorWrapper[err.response.data.message] || err.message,
      });
    }
  };
  return (
    <FormWrapper>
      <Stack
        alignItems="center"
        w="100%"
        maxW="600px"
        bgColor="white"
        p="3"
        borderRadius="lg"
      >
        <ProgressBar size="sm" steps={2} current={currentStepIndex + 1} />
      </Stack>

      <Stack
        justifyContent="center"
        alignItems="center"
        p="3"
        borderRadius="lg"
        bgColor="white"
        w="100%"
        maxW="600px"
        gap="4"
        overflow="hidden"
      >
        <Logo w="100px" />
        <motion.div
          style={{
            width: "100%",
            gap: "10px",
            display: "flex",
            flexDirection: "column",
          }}
          {...wrapperTransionStyles}
          key={currentStepIndex}
        >
          <CurrentStep
            errors={errors}
            currentStepIndex={currentStepIndex}
            register={register}
            control={control}
            setValue={setValue}
          />
        </motion.div>

        <Flex w="100%" justifyContent="start" gap="3">
          {isLastStep ? (
            <Button
              isLoading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              gap="3"
              colorScheme="blue"
            >
              تسجيل الدخول
            </Button>
          ) : (
            <Button
              isLoading={isValidating}
              onClick={HandleNext}
              gap="3"
              colorScheme="blue"
            >
              <FaArrowRight />
              التالي
            </Button>
          )}

          <Button
            isDisabled={isFirstStep}
            onClick={HandlePrev}
            gap="3"
            variant="outline"
            colorScheme="blue"
          >
            السابق
            <FaArrowLeft />
          </Button>
        </Flex>

        <Button ml="auto" mr="1" variant="link" as={Link} to="/register">
          ليس لديك حساب اضفط هنا لانشاء حساب
        </Button>
      </Stack>
    </FormWrapper>
  );
}
