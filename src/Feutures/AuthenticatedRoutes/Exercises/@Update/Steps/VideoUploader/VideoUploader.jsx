import React from "react";
import { VideoUploader } from "../../../../../../Components/Common/VideoUploader/VideoUploader";
import { useWatch } from "react-hook-form";
import { Heading } from "@chakra-ui/react";
import { CenteredTextWithLines } from "../../../../../../Components/Common/CenteredTextWithLines/CenteredTextWithLines";

export const VideoUploaderStep = ({ setValue, control }) => {
  const video = useWatch({ control, name: "video" });
  return (
    <>
      <CenteredTextWithLines>
        <Heading flexShrink="0" size="md">
          اضافة فيديو للتمرينة
        </Heading>
      </CenteredTextWithLines>

      <VideoUploader
        containerStyles={{
          maxH: "400px",
        }}
        onChange={(file) => setValue("video", file)}
        video={video}
      />
    </>
  );
};
