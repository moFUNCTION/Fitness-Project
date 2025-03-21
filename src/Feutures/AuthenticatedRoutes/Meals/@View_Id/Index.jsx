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
    endpoint: `meals/${id}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  console.log(data);

  const {
    title_ar,
    description_ar,
    title_en,
    description_en,
    video,
    createdAt,
    updatedAt,
    recoveryAndStretching,
    Cardio,
    Warmup,
    image,

    instructions,
  } = data?.data ? data.data : {};
  const [videoId] = video?.url ? video?.url?.split("/").slice(-1) : [];
  const [isPhoneQuery] = useMediaQuery("(max-width: 1200px)");

  console.log(data?.data);
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
                src={image}
                alt="image"
                borderRadius="lg"
                ImageProps={{
                  objectFit: "cover",
                }}
              />
            </Box>

            <Stack mt="6" spacing="3">
              <Heading size="md">العنوان : {title_ar}</Heading>
              <Text>الوصف : {description_ar || "لا يوجد وصف"}</Text>
              <Heading size="md">العنوان بالانجليزية : {title_ar}</Heading>
              <Text>الوصف بالانجليزية : {description_ar || "لا يوجد وصف"}</Text>
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
        <Heading size="md">العنوان بالعربية : {title_ar}</Heading>
        <Divider borderColor="gray.300" />
        <Heading size="md">
          الوصف بالعربية : {description_ar || "لا يوجد وصف"}
        </Heading>
        <Divider borderColor="gray.300" />
        <Heading size="md">العنوان بالانجليزية : {title_en}</Heading>
        <Divider borderColor="gray.300" />
        <Heading size="md">
          الوصف بالانجليزية : {description_en || "لا يوجد وصف"}
        </Heading>

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
