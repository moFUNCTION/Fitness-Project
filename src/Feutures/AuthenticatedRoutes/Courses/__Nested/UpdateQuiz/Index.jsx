import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { InputElement } from "../../../../../Components/Common/InputElement/InputElement";
import { useFieldArray, useForm } from "react-hook-form";
import { Pagination } from "../../../../../Components/Common/Pagination/Pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useFetch } from "../../../../../Hooks/useFetch/useFetch";
const QuiestionAnswerField = ({
  containerStyles,
  onChoose,
  isChoosed,
  ...params
}) => {
  return (
    <Tooltip label="اضغط اقصي اليمين اذا كنت تبغي انت تكون هذه هي الاجابة الصحيحة">
      <Flex
        borderRadius="lg"
        alignItems="center"
        bgColor="gray.100"
        p="3"
        gap="3"
        w="100%"
        {...containerStyles}
      >
        <Checkbox
          isChecked={isChoosed}
          onChange={(e) => e.target.checked && onChoose()}
          colorScheme="green"
          size="lg"
          bgColor="white"
        />
        <InputElement size="lg" {...params} />
      </Flex>
    </Tooltip>
  );
};
const arSuffix = ["الاولي", "الثانية", "الثالثة", "الرابعة"];
export default function Index() {
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { user } = useAuth();
  const { courseId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const {
    register,
    control,
    setValue,
    trigger,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    data,
    loading,
    error: GetQuizError,
  } = useFetch({
    endpoint: `/quizzes/getQuizForCourse/${courseId}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });

  useEffect(() => {
    if (data.data) {
      console.log("asasas", data.data);
      reset(data.data);
    }
  }, [JSON.stringify(data)]);

  const {
    fields: questions,
    append,
    replace,
    update,
    remove,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const onAddMoreQuestion = async () => {
    const isValid = await trigger([`questions`]);
    if (isValid) {
      append({
        question: "",
        options: [
          { key: "a", value: "" },
          { key: "b", value: "" },
          { key: "c", value: "" },
          { key: "d", value: "" },
        ],
        correctAnswer: "a",
      });
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const onChooseCorrectAnswer = (index, choosedAnswer) => {
    const { questions } = getValues();
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      correctAnswer: choosedAnswer,
    };
    console.log(newQuestions[index]);
    replace(newQuestions);
  };
  const onDelete = () => {
    remove(currentQuestion - 1);

    if (currentQuestion !== 1) {
      setCurrentQuestion((prev) => prev - 1);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };
  const error = errors?.questions?.[currentQuestion - 1];

  const onSubmit = async (data) => {
    const DataSend = {
      ...data,
      course: courseId,
    };
    await axiosInstance
      .put(`/quizzes/${data?.data?._id}`, DataSend, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      })
      .catch((err) => {
        toast({
          title: "خطأ في انشاء الامتحان",
          description: err.message,
          status: "error",
        });
      });
    toast({
      status: "success",
      title: "تم انشاء الامتحان بنجاح",
    });
    Navigate(`/courses/${courseId}/quizes`);
  };

  return (
    <Stack as={Skeleton} isLoaded={!loading} gap="4">
      <Heading size="md">انشاء امتحان</Heading>
      <Divider />
      <React.Fragment key={currentQuestion}>
        <InputElement
          name={`questions.${currentQuestion - 1}.question`}
          errorRef="question"
          errors={error}
          register={register}
          noIcon={true}
          placeholder="السؤال"
          as={Textarea}
        />
        <Flex justifyContent="center" wrap="wrap" gap="3">
          {questions[currentQuestion - 1]?.options?.map((option, index) => {
            const isChoosed =
              questions[currentQuestion - 1].correctAnswer === option.key;
            const AnswerError = error?.options?.[index];
            return (
              <QuiestionAnswerField
                errorRef="value"
                errors={AnswerError}
                key={option.key}
                placeholder={`الاجابة ${arSuffix[index]}`}
                register={register}
                name={`questions.${currentQuestion - 1}.options.${index}.value`}
                containerStyles={{
                  w: "500px",
                  flexGrow: "1",
                  bgColor: isChoosed ? "green.100" : "gray.100",
                  transition: "0.3s",
                }}
                isChoosed={isChoosed}
                onChoose={() =>
                  onChooseCorrectAnswer(currentQuestion - 1, option.key)
                }
              />
            );
          })}
        </Flex>
        {questions.length > 1 && (
          <Button
            onClick={onDelete}
            mr="auto"
            w="fit-content"
            colorScheme="red"
          >
            حذف السؤال
          </Button>
        )}
      </React.Fragment>

      <Pagination
        totalPages={questions.length}
        onPageChange={async (page) => {
          if (page > currentQuestion) {
            const isValid = await trigger([`questions.${currentQuestion - 1}`]);
            if (isValid) {
              setCurrentQuestion(page);
            }
          } else {
            setCurrentQuestion(page);
          }
        }}
        currentPage={currentQuestion}
      />
      <Button
        isDisabled={currentQuestion < questions.length}
        variant="outline"
        onClick={onAddMoreQuestion}
        colorScheme="blue"
      >
        اضافة سؤال اخر
      </Button>
      <Button
        isLoading={isSubmitting}
        colorScheme="green"
        onClick={handleSubmit(onSubmit)}
      >
        تحديث الامتحان
      </Button>
    </Stack>
  );
}
