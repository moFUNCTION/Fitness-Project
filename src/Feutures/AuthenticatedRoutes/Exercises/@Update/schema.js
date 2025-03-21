import { z } from "zod";

export const schema = z.object({
  video: z.any(),
  toolOrMachine: z.any(),
  deepAnatomy: z
    .array(z.any())
    .min(1, { message: "الرجاء ادخال علاقل تشريح عميق واحد" }),
  bodyPart: z.any(),
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
