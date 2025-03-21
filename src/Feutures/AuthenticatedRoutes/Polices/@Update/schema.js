import { z } from "zod";
export const schema = z.object({
  title: z.string().min(1, { message: "الرجاء ادخال العنوان" }),
  content: z.string().min(1, { message: "الرجاء ادخال المحتوي" }),
});
