import {
  Checkbox,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useWatch } from "react-hook-form";
import { ErrorText } from "../../../../../../Components/Common/ErrorText/ErrorText";

export const ExerciseExtraProps = ({ control, setValue, errors }) => {
  const Cardio = useWatch({ control, name: "Cardio" });
  const Warmup = useWatch({ control, name: "Warmup" });
  const recoveryAndStretching = useWatch({
    control,
    name: "recoveryAndStretching",
  });
  const targetGender = useWatch({ control, name: "targetGender" });

  const HandleChangeCheckbox = (e, name) => {
    setValue(name, e.target.checked);
  };

  return (
    <>
      <Checkbox
        isChecked={Cardio}
        onChange={(e) => HandleChangeCheckbox(e, "Cardio")}
        gap="3"
        bgColor="gray.50"
        borderRadius="lg"
        p="3"
      >
        كارديو
      </Checkbox>
      <Checkbox
        isChecked={Warmup}
        onChange={(e) => HandleChangeCheckbox(e, "Warmup")}
        gap="3"
        bgColor="gray.50"
        borderRadius="lg"
        p="3"
      >
        إحماء
      </Checkbox>
      <Checkbox
        isChecked={recoveryAndStretching}
        onChange={(e) => HandleChangeCheckbox(e, "recoveryAndStretching")}
        gap="3"
        bgColor="gray.50"
        borderRadius="lg"
        p="3"
      >
        التعافي والتمارين الإطالية
      </Checkbox>

      <RadioGroup
        value={targetGender}
        onChange={(value) => setValue("targetGender", value)}
      >
        <Flex justifyContent="space-around" bgColor="gray.50" p="3">
          <Text>الجنس المستهدف</Text>
          <Flex gap="6">
            <Radio value="men">الرجال</Radio>
            <Radio value="women">النساء</Radio>
          </Flex>
        </Flex>
      </RadioGroup>
      <ErrorText>{errors?.targetGender?.message}</ErrorText>
    </>
  );
};
