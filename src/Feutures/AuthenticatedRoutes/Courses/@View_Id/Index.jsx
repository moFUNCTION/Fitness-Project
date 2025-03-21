import {
  Box,
  Flex,
  Stack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  useDisclosure,
  Skeleton,
  AspectRatio,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { LazyLoadedImage } from "../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { Link, Outlet, useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import BackgroundImage from "../../../../Assets/Backgrounds/Image.jpg";

export default function Index() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useFetch({
    endpoint: `Courses/${courseId}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  console.log(data);

  const {
    title,
    description,
    createdAt,
    image,
    updatedAt,
    _id,
    onRender,
    price,
    priceAfterDiscount,
  } = data?.data ? data.data : {};
  const [isPhoneQuery] = useMediaQuery("(max-width: 1200px)");
  return (
    <Flex
      background="linear-gradient(70deg, rgba(24,16,163,1) 0%, rgba(6,6,172,1) 9%, rgba(0,150,198,1) 100%)"
      pos="relative"
      bgColor="blue.500"
      gap="4"
      p="3"
      w="100%"
      h="100%"
      overflow="auto"
      flexWrap="wrap"
      justifyContent="center"
    >
      <Card
        boxShadow="lg"
        pos={!isPhoneQuery && "sticky"}
        top="0"
        mt="5"
        h="fit-content"
        w="sm"
        maxW="md"
        flexGrow="1"
        as={Skeleton}
        isLoaded={!loading}
      >
        <CardBody>
          <LazyLoadedImage
            w="100%"
            h="200px"
            src={image}
            alt="image"
            borderRadius="lg"
            ImageProps={{
              objectFit: "cover",
            }}
          />

          <Stack mt="6" spacing="3">
            <Heading size="md">العنوان : {title}</Heading>
            <Text>الوصف : {description || "لا يوجد وصف"}</Text>
            <Divider />
            <Text>السعر : {price || "لا يوجد وصف"}</Text>
            <Text>السعر بعد الخصم : {priceAfterDiscount || "لا يوجد وصف"}</Text>

            <Text>
              تم الانشاء : {new Date(createdAt).toLocaleString("ar-EG")}
            </Text>
            {updatedAt && (
              <Text>
                تم التحديث : {new Date(updatedAt).toLocaleString("ar-EG")}
              </Text>
            )}
            <Flex gap="3" mt="4">
              <Button
                colorScheme="green"
                as={Link}
                to={`/courses/update/${courseId}`}
              >
                تعديل
              </Button>
            </Flex>
          </Stack>
        </CardBody>
        <Divider />
      </Card>

      <Stack
        bgColor="white"
        as={Skeleton}
        isLoaded={!loading}
        borderRadius="lg"
        border="1px"
        borderColor="gray.300"
        w="500px"
        flexGrow="1"
        maxW="100%"
        h="fit-content"
        p="3"
        sx={{
          color: "gray.700",
        }}
      >
        <Flex flexWrap="wrap" w="100%" justifyContent="center" gap="3">
          <Button
            as={Link}
            to="lessons"
            colorScheme="blue"
            variant="outline"
            borderRadius="full"
          >
            الدروس
          </Button>
          <Button
            as={Link}
            to="lessons/add"
            colorScheme="blue"
            variant="outline"
            borderRadius="full"
          >
            انشاء درس
          </Button>
          <Button
            as={Link}
            colorScheme="blue"
            variant="outline"
            borderRadius="full"
            to="quizes"
          >
            الامتحان
          </Button>
          <Button
            as={Link}
            colorScheme="blue"
            variant="outline"
            borderRadius="full"
            to="quizes/add"
          >
            انشاء امتحان
          </Button>
          <Button
            as={Link}
            colorScheme="blue"
            variant="outline"
            to="users"
            borderRadius="full"
          >
            المستخدمين
          </Button>
        </Flex>
        <Divider mt="3" />
        <Outlet />
      </Stack>
    </Flex>
  );
}
