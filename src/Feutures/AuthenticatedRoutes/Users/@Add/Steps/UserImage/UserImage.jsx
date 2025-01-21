import React from "react";
import { UserImageUploader } from "../../../../../../Components/Common/UserImageUploader/UserImageUploader";
import Lottie from "lottie-react";
import AnimationData from "../../../../../../Assets/ImageUploaderAnimation/imageUploaderAnimation.json";
import { useWatch } from "react-hook-form";
export const UserImage = ({ control, setValue }) => {
  const image = useWatch({
    control,
    name: "profileImg",
  });
  const onChangeImage = (file) => setValue("profileImg", file);
  return (
    <UserImageUploader
      onChange={onChangeImage}
      onRemove={() => setValue("profileImg", undefined)}
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
