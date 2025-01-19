import React from "react";
import { UserImageUploader } from "../../../../../Components/Common/UserImageUploader/UserImageUploader";
import Lottie from "lottie-react";
import AnimationData from "../../../../../Assets/ImageUploaderAnimation/imageUploaderAnimation.json";
import { useWatch } from "react-hook-form";
export const UserImage = ({ control, setValue }) => {
  const image = useWatch({
    control,
    name: "image",
  });
  const onChangeImage = (file) => setValue("image", file);
  return (
    <UserImageUploader
      onChange={onChangeImage}
      onRemove={() => setValue("image", undefined)}
      img={image}
    >
      <Lottie
        style={{
          width: "100px",
        }}
        animationData={AnimationData}
      />
    </UserImageUploader>
  );
};
