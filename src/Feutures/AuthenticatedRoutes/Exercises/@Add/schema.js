import { z } from "zod";
const videoFileSchema = z.custom(
  (file) => {
    if (!(file instanceof File)) {
      return false;
    }

    const allowedMimeTypes = ["video/mp4", "video/avi", "video/mov"];
    if (!allowedMimeTypes.includes(file.type)) {
      return false;
    }

    const maxSizeInBytes = 300 * 1024 * 1024; // 300 MB
    if (file.size > maxSizeInBytes) {
      return false;
    }

    return true;
  },
  {
    message:
      "Invalid video file. Ensure it is a supported format (mp4, avi, mov) and under 100MB.",
  }
);
export const schema = z.object({
  video: videoFileSchema,
  toolOrMachine: z.object(
    {
      title: z.string({
        message: "title required",
      }),
      createdAt: z.string({
        message: "createdAt required",
      }),
      updatedAt: z.string({
        message: "updatedAt required",
      }),
      _id: z.string({
        message: "Id is Required",
      }),
    },
    { message: "الرجاء اختيار الجهاز او الاداه المستخدمة" }
  ),
  deepAnatomy: z
    .array(z.any())
    .min(1, { message: "الرجاء ادخال علاقل تشريح عميق واحد" }),
  bodyPart: z.object(
    {
      title: z.string({
        message: "title required",
      }),
      createdAt: z.string({
        message: "createdAt required",
      }),
      updatedAt: z.string({
        message: "updatedAt required",
      }),
      _id: z.string({
        message: "Id is Required",
      }),
    },
    { message: "الرجاء اختيار العضو المحدد" }
  ),
  title: z.string().min(1, { message: "الرجاء ادخال العنوان" }),
  description: z.string().min(1, { message: "الرجاء ادخال الوصف" }),
  instructions: z
    .string()
    .min(1, { message: "الرجاء الدخال خطوات التمرين" })
    .min(15, {
      message: "الرجاء كتابة الخطوات بشكل مفصل واطول قليلا (اكثر من 15 كلمة)",
    }),
  Cardio: z.boolean(),
  Warmup: z.boolean(),
  recoveryAndStretching: z.boolean(),
  targetGender: z.enum(["men", "women"], {
    message: "الرجاء اختيار الجنس المستهدف",
  }),
});
