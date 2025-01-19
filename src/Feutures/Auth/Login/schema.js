import { z } from "zod";

export const schema = z.object({
  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .min(1, "البريد الإلكتروني مطلوب"),
  password: z.string().min(1, { message: "الرجاء ادخال كلمة المرور" }),
});
