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
import { useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import BackgroundImage from "../../../../Assets/Backgrounds/Image.jpg";

export default function Index() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useFetch({
    endpoint: `Exercises/${id}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  console.log(data);

  const {
    title,
    Description,
    video,
    createdAt,
    updatedAt,
    recoveryAndStretching,
    Cardio,
    Warmup,
    _id,
    bodyPart,
    toolOrMachine,
    targetGender,
    instructions,
  } = data?.data ? data.data : {};
  const [videoId] = video?.url ? video?.url?.split("/").slice(-1) : [];
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
    >
      {!isPhoneQuery && (
        <Card
          mt="auto"
          mb="auto"
          boxShadow="lg"
          pos="sticky"
          top="0"
          h="fit-content"
          maxW="sm"
          as={Skeleton}
          isLoaded={!loading}
          w="100%"
        >
          <CardBody>
            <Box
              overflow="hidden"
              borderRadius="lg"
              _hover={{
                ".player": {
                  opacity: 1,
                },
              }}
              pos="relative"
            >
              <LazyLoadedImage
                w="100%"
                h="200px"
                src={video?.thumbnail}
                alt="image"
                borderRadius="lg"
                ImageProps={{
                  objectFit: "cover",
                }}
              />
            </Box>

            <Stack mt="6" spacing="3">
              <Heading size="md">العنوان : {title}</Heading>
              <Text>الوصف : {Description || "لا يوجد وصف"}</Text>
              <Text>
                تم الانشاء : {new Date(createdAt).toLocaleString("ar-EG")}
              </Text>
              {updatedAt && (
                <Text>
                  تم التحديث : {new Date(updatedAt).toLocaleString("ar-EG")}
                </Text>
              )}
              <Text>
                هل به تمارين تعافي واطالة :
                {recoveryAndStretching ? "نعم" : "لا"}
              </Text>
              <Text>هل به كارديو :{Cardio ? "نعم" : "لا"}</Text>
              <Text>هل به احماء : {Warmup ? "نعم" : "لا"}</Text>
            </Stack>
          </CardBody>
          <Divider />
        </Card>
      )}

      <Stack
        bgColor="gray.50"
        as={Skeleton}
        isLoaded={!loading}
        borderRadius="lg"
        border="1px"
        borderColor="gray.300"
        w="100%"
        h="fit-content"
        p="3"
        sx={{
          color: "gray.700",
        }}
      >
        <AspectRatio borderRadius="lg" bgColor="gray" w="100%" ratio={16 / 9}>
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            allowFullScreen
          />
        </AspectRatio>
        <Heading size="md">العنوان : {title}</Heading>
        <Divider borderColor="gray.300" />
        <Heading size="md">الوصف : {Description || "لا يوجد وصف"}</Heading>
        <Divider borderColor="gray.300" />

        <Heading size="md">
          تم الانشاء : {new Date(createdAt).toLocaleString("ar-EG")}
        </Heading>
        <Divider borderColor="gray.300" />
        {updatedAt && (
          <Heading size="md">
            تم التحديث : {new Date(updatedAt).toLocaleString("ar-EG")}
          </Heading>
        )}
        <Divider borderColor="gray.300" />
        <Heading size="md">
          هل به تمارين تعافي واطالة :{recoveryAndStretching ? "نعم" : "لا"}
        </Heading>
        <Divider borderColor="gray.300" />
        <Heading size="md">هل به كارديو :{Cardio ? "نعم" : "لا"}</Heading>
        <Divider borderColor="gray.300" />
        <Heading size="md">هل به احماء : {Warmup ? "نعم" : "لا"}</Heading>
        <Divider borderColor="gray.300" />
        <Heading size="md">الالات المستخدمة : {toolOrMachine?.title} </Heading>
        <Divider borderColor="gray.300" />
        <Heading size="md">
          العضو المستهدف : {bodyPart?.title || "غير محدد"}{" "}
        </Heading>
        <Divider borderColor="gray.300" />
        <Heading display="flex" alignItems="center" gap="3" size="md">
          <FaUser />
          الجنس المستهدف : {targetGender === "men" ? "رجال" : "نساء"}
        </Heading>
        <Divider borderColor="gray.300" />
        <Heading size="md">الخطوات : {instructions || "غير محددة"}</Heading>
        <Divider borderColor="gray.300" />
        <Flex gap="3" mt="4">
          <Button colorScheme="red">حذف</Button>
          <Button colorScheme="green">تعديل</Button>
        </Flex>
      </Stack>
    </Flex>
  );
}
