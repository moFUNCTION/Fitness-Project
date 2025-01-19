import { Button, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useFetch } from "../../../../../Hooks/useFetch/useFetch";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Pagination } from "../../../../../Components/Common/Pagination/Pagination";
const Field = ({ label, value, ...rest }) => {
  return (
    <Flex
      alignItems="center"
      gap="4"
      p="3"
      borderRadius="lg"
      bgColor="gray.50"
      {...rest}
    >
      <Button colorScheme="blue"> {label}</Button>
      <Text fontSize="lg">{value}</Text>
    </Flex>
  );
};
const arSuffix = ["الاولي", "الثانية", "الثالثة", "الرابعة"];

export default function Index() {
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const { user } = useAuth();
  const { courseId } = useParams();
  const { data, loading, error } = useFetch({
    endpoint: `/quizzes/getQuizForCourse/${courseId}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  const { questions, _id, createdAt, updatedAt } = data?.data ? data.data : {};
  console.log(questions);
  return (
    <Stack overflow="hidden" as={Skeleton} isLoaded={!loading}>
      <Flex gap="3">
        <Button>
          تاريخ الانشاء :{new Date(createdAt).toLocaleString("ar-eg")}
        </Button>
        {updatedAt && (
          <Button>
            تاريخ التديث :{new Date(updatedAt).toLocaleString("ar-eg")}
          </Button>
        )}
      </Flex>
      <Stack key={currentQuestion} className="show-opacity-animation">
        <Field
          value={questions?.[currentQuestion - 1]?.question}
          label="السؤال"
        />
        <Flex justifyContent="center" wrap="wrap" gap="3">
          {questions?.[currentQuestion - 1]?.options?.map((option, index) => {
            const isChoosed =
              questions?.[currentQuestion - 1].correctAnswer === option.key;
            return (
              <Field
                key={option.key}
                value={option.value}
                label={`الاجابة ${arSuffix[index]}`}
                w="500px"
                flexGrow="1"
                bgColor={isChoosed ? "green.100" : "gray.100"}
                transition="0.3s"
              />
            );
          })}
        </Flex>
      </Stack>
      <Pagination
        onPageChange={setCurrentQuestion}
        totalPages={questions?.length}
        currentPage={currentQuestion}
      />
      <Flex gap="3">
        <Button as={Link} to={`update/${_id}`} colorScheme="green" size="lg">
          تحديث
        </Button>
        <Button colorScheme="red" size="lg">
          حذف
        </Button>
      </Flex>
    </Stack>
  );
}
