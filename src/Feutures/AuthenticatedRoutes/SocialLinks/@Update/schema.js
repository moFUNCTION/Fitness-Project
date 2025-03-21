import { z } from "zod";
export const schema = z.object({
  title: z.string().min(1, { message: "الرجاء ادخال العنوان" }),
  link: z.string().url({ message: "الرجاء ادخال رابط فعال" }),
  image: z.any(),
});
