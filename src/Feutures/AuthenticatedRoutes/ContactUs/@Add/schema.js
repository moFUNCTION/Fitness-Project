import { z } from "zod";
export const schema = z.object({
  name: z.string().min(1, { message: "الرجاء ادخال الاسم" }),
  email: z
    .string()
    .min(1, { message: "الرجاء ادخال البريد الالكتروني" })
    .email({
      message: "الرجاء ادخال بريد صالح",
    }),
  phone: z.string().min(1, {
    message: "الرجاء ادخال رقم الهاتف",
  }),
});
