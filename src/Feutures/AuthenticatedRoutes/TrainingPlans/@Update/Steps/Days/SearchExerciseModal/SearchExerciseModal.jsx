import {
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { LazyLoadedImage } from "../../../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { InputElement } from "../../../../../../../Components/Common/InputElement/InputElement";
import { Pagination } from "../../../../../../../Components/Common/Pagination/Pagination";
import { useAuth } from "../../../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useFetch } from "../../../../../../../Hooks/useFetch/useFetch";
import { useOveride } from "../../../../../../../Hooks/useOveride/useOveride";

// Exercise Information Field Component
const ExerciseField = ({ label, value, size = "xs" }) => (
  <Flex gap="4" alignItems="center">
    <Button colorScheme="blue" variant="outline" bgColor="white" size={size}>
      {label}
    </Button>
    <Text fontSize={size}>{value || "غير محدد"}</Text>
  </Flex>
);

// Exercise Card Component
const ExerciseCard = ({ exercise, onChoose, selectedExercise }) => {
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const isChoosed = selectedExercise?._id === exercise._id;

  return (
    <Flex
      gap="4"
      borderRadius="lg"
      bgColor={isChoosed ? "green.100" : cardBg}
      p="3"
      w="100%"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
      pos="relative"
      flexWrap="wrap"
    >
      <LazyLoadedImage
        src={exercise.video.thumbnail}
        w="80px"
        h="auto"
        ImageProps={{
          objectFit: "cover",
        }}
        borderRadius="lg"
      />
      <Stack spacing={3}>
        <ExerciseField label="الاسم" value={exercise.title} />
        <ExerciseField label="الوصف" value={exercise.Description} />
        <ExerciseField label="العضو" value={exercise.bodyPart?.title} />
      </Stack>
      <Button
        onClick={() => onChoose(exercise)}
        colorScheme="green"
        mr="auto"
        mt="auto"
        variant={isChoosed ? "outline" : "solid"}
        bgColor={isChoosed && "white"}
      >
        {isChoosed ? "تم الاختيار" : "اختيار"}
      </Button>
    </Flex>
  );
};

// Search Section Component
const SearchSection = ({ onSearch }) => (
  <InputElement
    Icon={MdSearch}
    placeholder="البحث"
    onChange={(e) => onSearch(e.target.value)}
  />
);

// Exercise List Component
const ExerciseList = ({ data, loading, onChoose, selectedExercise }) => (
  <Stack
    mt="2"
    overflow="auto"
    minH="150px"
    as={Skeleton}
    isLoaded={!loading}
    w="100%"
    maxH="50vh"
    spacing={3}
    p="3"
  >
    {data?.data?.map((exercise) => (
      <ExerciseCard
        onChoose={onChoose}
        key={exercise._id}
        exercise={exercise}
        selectedExercise={selectedExercise}
      />
    ))}
  </Stack>
);

// Modal Footer Component
const ModalActions = ({ onClose, onConfirm }) => (
  <ModalFooter gap="3">
    <Button colorScheme="red" onClick={onClose}>
      غلق
    </Button>
    <Button colorScheme="blue" onClick={onConfirm}>
      تأكيد
    </Button>
  </ModalFooter>
);

// Main Modal Component
export const SearchExerciseModal = ({
  onClose,
  isOpen,
  role = "Add",
  onSubmit,
}) => {
  const [selectedExercise, setSelectedExercise] = useState();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, HandleRender, error } = useFetch({
    endpoint: "/Exercises",
    params: {
      page,
      keyword: searchQuery,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  console.log(error, "asas");

  useOveride();

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };
  console.log(selectedExercise);

  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent overflow="auto" maxH="100vh">
        <ModalHeader>التمرينات</ModalHeader>
        <ModalCloseButton />

        <ModalBody gap="4">
          <SearchSection onSearch={handleSearch} />
          <ExerciseList
            onChoose={(exercise) => setSelectedExercise(exercise)}
            data={data}
            loading={loading}
            selectedExercise={selectedExercise}
          />

          <Pagination
            isLoading={loading}
            totalPages={data?.paginationResult?.numberOfPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </ModalBody>

        <ModalActions
          onClose={onClose}
          onConfirm={() => {
            onSubmit(selectedExercise);
          }}
        />
      </ModalContent>
    </Modal>
  );
};
