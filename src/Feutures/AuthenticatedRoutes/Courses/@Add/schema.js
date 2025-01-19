import { z } from "zod";

export const LessonCreationSchema = z.object({
  title: z
    .string({
      required_error: "العنوان مطلوب",
      invalid_type_error: "يجب أن يكون العنوان نصًا",
    })
    .min(3, {
      message: "يجب أن يكون العنوان على الأقل 3 أحرف",
    })
    .max(100, {
      message: "يجب أن لا يتجاوز العنوان 100 حرف",
    }),

  description: z
    .string({
      required_error: "الوصف مطلوب",
      invalid_type_error: "يجب أن يكون الوصف نصًا",
    })
    .min(20, {
      message: "يجب أن يكون الوصف على الأقل 15 أحرف",
    })
    .max(500, {
      message: "يجب أن لا يتجاوز الوصف 500 حرف",
    }),

  image: z.instanceof(File, {
    message: "يرجى تحميل صورة",
  }),
  price: z.number({ message: "الرجاء ادخال سعر الكورس" }).min(0, {
    message: "سعر الكورس لا يقل عن 0",
  }),
  priceAfterDiscount: z.any(),
  category: z
    .string({
      message: "الرجاء اختيار الصنف",
    })
    .min(1, {
      message: "الرجاء اختيار الصنف",
    }),
});
