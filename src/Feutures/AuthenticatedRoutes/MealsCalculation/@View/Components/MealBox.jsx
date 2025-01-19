import React from "react";
import {
  Box,
  Image,
  Text,
  Flex,
  Grid,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Divider,
  SimpleGrid,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { LazyLoadedImage } from "../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { Link } from "react-router-dom";

export const MealBox = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        onClick={onOpen}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        _hover={{ shadow: "md" }}
        dir="rtl"
        w="100%"
        maxW="400px"
      >
        <Flex flexWrap="wrap" gap={4}>
          <LazyLoadedImage
            src={data.image}
            alt={data.Title_AR}
            boxSize="120px"
            ImageProps={{
              objectFit: "contain",
            }}
            borderRadius="md"
            bgColor="gray.50"
          />
          <Box flex={1}>
            <Flex flexWrap="wrap" justify="space-between" align="start" mb={2}>
              <Box>
                <Text fontSize="xl" fontWeight="bold">
                  {data.Title_AR}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {data.Title_EN}
                </Text>
              </Box>
              <Badge colorScheme="blue" fontSize="md" px={2} py={1}>
                {data.Calories} سعرة
              </Badge>
            </Flex>

            <SimpleGrid columns={2} spacing={3} mt={4}>
              <Box bg="green.50" p={2} borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  بروتين
                </Text>
                <Text fontWeight="bold">{data.Protein} جرام</Text>
              </Box>
              <Box bg="yellow.50" p={2} borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  كربوهيدرات
                </Text>
                <Text fontWeight="bold">{data.Carbohydrates} جرام</Text>
              </Box>
              <Box bg="red.50" p={2} borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  دهون
                </Text>
                <Text fontWeight="bold">{data.Fats} جرام</Text>
              </Box>
              <Box bg="purple.50" p={2} borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  سكر
                </Text>
                <Text fontWeight="bold">{data.Sugar} جرام</Text>
              </Box>
            </SimpleGrid>
          </Box>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent overflow="auto" maxH="calc(100vh - 30px)" dir="rtl">
          <ModalHeader>
            <Text fontSize="2xl">{data.Title_AR}</Text>
            <Text fontSize="md" color="gray.600">
              {data.Title_EN}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  العناصر الغذائية الأساسية
                </Text>
                <SimpleGrid columns={[2, 3]} spacing={3}>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                      سعرات حرارية
                    </Text>
                    <Text fontWeight="bold">{data.Calories}</Text>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                      بروتين
                    </Text>
                    <Text fontWeight="bold">{data.Protein} جرام</Text>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                      كربوهيدرات
                    </Text>
                    <Text fontWeight="bold">{data.Carbohydrates} جرام</Text>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                      دهون
                    </Text>
                    <Text fontWeight="bold">{data.Fats} جرام</Text>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                      ألياف
                    </Text>
                    <Text fontWeight="bold">{data.Fiber} جرام</Text>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                      سكر
                    </Text>
                    <Text fontWeight="bold">{data.Sugar} جرام</Text>
                  </Box>
                </SimpleGrid>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  الفيتامينات
                </Text>
                <SimpleGrid columns={[2, 3, 4]} spacing={3}>
                  {["A", "C", "D", "E", "K"].map((vitamin) => (
                    <Box key={vitamin} bg="blue.50" p={2} borderRadius="md">
                      <Text fontSize="sm" color="gray.600">
                        فيتامين {vitamin}
                      </Text>
                      <Text fontWeight="bold">
                        {data[`Vitamin_${vitamin}`]} ملجم
                      </Text>
                    </Box>
                  ))}
                  {["B1", "B2", "B3", "B5", "B6", "B7", "B9", "B12"].map(
                    (vitamin) => (
                      <Box key={vitamin} bg="green.50" p={2} borderRadius="md">
                        <Text fontSize="sm" color="gray.600">
                          فيتامين {vitamin}
                        </Text>
                        <Text fontWeight="bold">
                          {data[`Vitamin_${vitamin}`]} ملجم
                        </Text>
                      </Box>
                    )
                  )}
                </SimpleGrid>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  المعادن
                </Text>
                <SimpleGrid columns={[2, 3, 4]} spacing={3}>
                  {[
                    { key: "Calcium", label: "كالسيوم" },
                    { key: "Iron", label: "حديد" },
                    { key: "Magnesium", label: "ماغنيسيوم" },
                    { key: "Phosphorus", label: "فوسفور" },
                    { key: "Potassium", label: "بوتاسيوم" },
                    { key: "Sodium", label: "صوديوم" },
                    { key: "Zinc", label: "زنك" },
                    { key: "Copper", label: "نحاس" },
                    { key: "Manganese", label: "منغنيز" },
                    { key: "Selenium", label: "سيلينيوم" },
                  ].map((mineral) => (
                    <Box
                      key={mineral.key}
                      bg="purple.50"
                      p={2}
                      borderRadius="md"
                    >
                      <Text fontSize="sm" color="gray.600">
                        {mineral.label}
                      </Text>
                      <Text fontWeight="bold">{data[mineral.key]} ملجم</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter gap="3">
            <Button colorScheme="green" as={Link} to={`${data._id}/Update`}>
              تعديل
            </Button>
            <Button colorScheme="red">حذف</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
