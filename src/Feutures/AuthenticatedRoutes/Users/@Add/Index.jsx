import { Button, Flex, Heading, Stack, useToast } from "@chakra-ui/react";
import { useMultipleFormSteps } from "../../../../Hooks/useMultipleFormSteps/useMultipleFormSteps";
import { UserInformation } from "./Steps/Userinformation/UserInformation";
import { FormWrapper } from "./FormWrapper/FormWrapper";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { JopRole } from "./Steps/JopRole/JopRole";
import { schema } from "./schema";
import { ProgressBar } from "../../../../Components/Common/ProgressBar/ProgressBar";
import { UserImage } from "./Steps/UserImage/UserImage";
import { UserPassword } from "./Steps/UserPassword/UserPassword";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
export default function Index() {
  const { user } = useAuth();
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const {
    formState: { errors, isSubmitting, isValidating, isLoading },
    register,
    HandleNext,
    HandlePrev,
    isLastStep,
    isFirstStep,
    handleSubmit,
    CurrentStep,
    currentStepIndex,
    control,
    setValue,
    wrapperTransionStyles,
  } = useMultipleFormSteps({
    steps: [
      {
        Component: UserInformation,
        fieldsRequired: ["username", "email", "phoneNumber"],
      },
      {
        Component: JopRole,
        fieldsRequired: ["role", "choosedMarket"],
      },
      {
        Component: UserImage,
      },
      {
        Component: UserPassword,
        fieldsRequired: ["password", "confirmPassword"],
      },
    ],
    schema: schema,
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    const DataSend = new FormData();
    for (let key in data) {
      DataSend.append(key, data[key]);
    }
    try {
      await axiosInstance.post(`/users`, DataSend, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      toast({
        title: "تم انشاء الحساب بنجاح",
        status: "success",
      });
      Navigate("/users");
    } catch (Err) {
      console.log(Err);
      toast({
        title: "خطأ في انشاء الحساب ",
        status: "error",
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
        <ProgressBar size="sm" steps={4} current={currentStepIndex + 1} />
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
        <Heading p="4" bgColor="gray.50" borderRadius="lg" size="sm">
          اضافة مستخدم في النظام
        </Heading>
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
              colorScheme="green"
            >
              انشاء الحساب
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
            colorScheme="blue"
            variant="outline"
          >
            السابق
            <FaArrowLeft />
          </Button>
        </Flex>
      </Stack>
    </FormWrapper>
  );
}
