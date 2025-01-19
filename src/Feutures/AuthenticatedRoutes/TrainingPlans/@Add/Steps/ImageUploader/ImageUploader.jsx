import React from "react";
import { ImageUploader as ImageUploaderComponent } from "../../../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { Controller } from "react-hook-form";
export const ImageUploader = ({ control }) => {
  return (
    <Controller
      name="image"
      control={control}
      render={({ field }) => {
        return (
          <ImageUploaderComponent
            label="رفع صورة"
            onChangeImage={(image) => field.onChange(image)}
            onRemoveImage={() => field.onChange(undefined)}
            img={field.value}
          />
        );
      }}
    />
  );
};
