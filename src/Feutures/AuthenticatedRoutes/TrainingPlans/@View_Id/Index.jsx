import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Stack,
  HStack,
  Badge,
  Icon,
  Divider,
  Skeleton,
  useDisclosure,
  CardFooter,
  Flex,
  Button,
} from "@chakra-ui/react";
import React, { memo, useState, useEffect, useRef } from "react";
import { BsCalendarWeek, BsClock, BsArrowRepeat } from "react-icons/bs";
import { GiWeightLiftingUp } from "react-icons/gi";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Link, useParams } from "react-router-dom";
import { LazyLoadedImage } from "../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { FaPlay } from "react-icons/fa";
import { VideoViewerModal } from "../../../../Components/Common/VideoViewerModal/VideoViewerModal";

// Lazy-load observer
const useLazyLoad = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
};

// Component for displaying exercise details
const ExerciseCard = memo(
  ({
    exercise: { exercise, sets, reps, restBetweenExercises, restBetweenSets },
    index,
  }) => {
    const {
      onOpen: onOpenVideoModal,
      onClose: onCloseVideoModal,
      isOpen: isOpenedVideoModal,
    } = useDisclosure();
    const [videoId] = exercise?.video?.url
      ? exercise.video.url.split("/")?.slice(-1)
      : [];

    return (
      <>
        <VideoViewerModal
          url={`https://player.vimeo.com/video/${videoId}`}
          isOpen={isOpenedVideoModal}
          onClose={onCloseVideoModal}
        />
        <Card
          bg="white"
          borderColor="gray.200"
          borderWidth="1px"
          borderRadius="lg"
          _hover={{ transform: "translateY(-2px)", shadow: "md" }}
          transition="all 0.2s"
        >
          <CardHeader pb={2}>
            <HStack spacing={2}>
              <Icon as={GiWeightLiftingUp} color="blue.500" />
              <Heading size="sm">تمرين {index + 1}</Heading>
            </HStack>
          </CardHeader>
          <Divider m="0 auto" my="2" w="80%" />

          <CardBody pt={0}>
            <Stack spacing={3}>
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
                <Stack
                  opacity="0"
                  className="player"
                  pos="absolute"
                  inset="0"
                  zIndex="1"
                  bgColor="blue.600"
                  justifyContent="center"
                  alignItems="center"
                  transition="0.3s"
                  cursor="pointer"
                  onClick={onOpenVideoModal}
                >
                  <FaPlay color="white" fontSize="40px" />
                </Stack>
                <LazyLoadedImage
                  w="100%"
                  h="200px"
                  src={exercise?.video?.thumbnail}
                  alt="image"
                  borderRadius="lg"
                  ImageProps={{
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Heading size="md">العنوان : {exercise.title}</Heading>
              <Text>الوصف : {exercise.Description || "لا يوجد وصف"}</Text>
              <Text>
                تم الانشاء :{" "}
                {new Date(exercise.createdAt).toLocaleString("ar-EG")}
              </Text>
              {exercise.updatedAt && (
                <Text>
                  تم التحديث :{" "}
                  {new Date(exercise.updatedAt).toLocaleString("ar-EG")}
                </Text>
              )}
              <Text>
                هل به تمارين تعافي واطالة :
                {exercise.recoveryAndStretching ? "نعم" : "لا"}
              </Text>
              <Text>هل به كارديو :{exercise.Cardio ? "نعم" : "لا"}</Text>
              <Text>هل به احماء : {exercise.Warmup ? "نعم" : "لا"}</Text>

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  عدد المجموعات:
                </Text>
                <Badge colorScheme="blue">{sets} مجموعات</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  عدد التكرارات:
                </Text>
                <Badge colorScheme="green">{reps} مرات</Badge>
              </HStack>
              <Divider />
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  <Icon as={BsClock} mr={1} />
                  الراحة بين المجموعات:
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  {restBetweenSets} ثانية
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  <Icon as={BsClock} mr={1} />
                  الراحة بين التمارين:
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  {restBetweenExercises} ثانية
                </Text>
              </HStack>
            </Stack>
          </CardBody>
          <CardFooter>
            <Button
              w="full"
              as={Link}
              to={`/exercises/${exercise._id}`}
              variant="solid"
              colorScheme="blue"
            >
              مشاهدة
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  }
);
ExerciseCard.displayName = "ExerciseCard";

// Component for displaying day's workout
const DayPanel = memo(({ day }) => {
  const ref = useRef();
  const isVisible = useLazyLoad(ref);

  return (
    <Stack ref={ref} spacing={6}>
      {isVisible && (
        <>
          <HStack>
            <Icon as={BsCalendarWeek} color="blue.500" boxSize={6} />
            <Heading size="md">اليوم {day.dayNumber}</Heading>
          </HStack>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={4}
          >
            {day.exercises.map((exercise, index) => (
              <GridItem key={exercise._id}>
                <ExerciseCard exercise={exercise} index={index} />
              </GridItem>
            ))}
          </Grid>
        </>
      )}
    </Stack>
  );
});
DayPanel.displayName = "DayPanel";

export default function Index() {
  const { user } = useAuth();
  const { id } = useParams();
  const {
    data: ApiResponce,
    loading,
    HandleRender,
  } = useFetch({
    endpoint: `/trainingPlan/${id}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  const { data } = ApiResponce ? ApiResponce : {};
  console.log(data);

  return (
    <Container maxW="container" py={8} dir="rtl">
      <Stack as={Skeleton} isLoaded={!loading} spacing={8}>
        {/* Header Section */}
        <Box p={6} borderRadius="lg">
          <Stack spacing={4}>
            <HStack>
              <Icon
                as={MdOutlineSportsGymnastics}
                boxSize={8}
                color="blue.500"
              />
              <Heading size="lg">{data?.title}</Heading>
            </HStack>
            <Text fontSize="md" color="gray.600">
              {data?.description}
            </Text>
            <HStack>
              <Icon as={BsArrowRepeat} color="blue.500" />
              <Text fontWeight="bold">{data?.days.length} أيام في الأسبوع</Text>
            </HStack>
          </Stack>
        </Box>

        {/* Workout Days Tabs */}
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            {data?.days.map((day) => (
              <Tab key={day._id}>
                يوم {day.dayNumber} {`(${day.dayTitle})`}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {data?.days.map((day) => (
              <TabPanel key={day._id}>
                <DayPanel day={day} />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* Metadata */}
        <Box>
          <Text fontSize="sm" color="gray.500" textAlign="start">
            تم الإنشاء: {new Date(data?.createdAt).toLocaleDateString("ar-EG")}
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="start">
            آخر تحديث: {new Date(data?.updatedAt).toLocaleDateString("ar-EG")}
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
