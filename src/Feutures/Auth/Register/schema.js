import { z } from "zod";

export const schema = z
  .object({
    email: z
      .string()
      .email("البريد الإلكتروني غير صالح")
      .min(1, "البريد الإلكتروني مطلوب"),
    username: z.string().min(1, "اسم المستخدم مطلوب"),
    phoneNumber: z
      .string()
      .regex(/^01[0-5][0-9]{8}$/, "رقم الهاتف المصري غير صالح") // Updated Egyptian phone number validation
      .min(1, "رقم الهاتف مطلوب"), // Phone number is required in Arabic
    role: z.enum(["Super-Admin", "Employer", "Accountant"], {
      message: "الدور غير صالح",
    }),
    password: z.string().min(8, "كلمة المرور يجب أن تكون على الأقل 8 أحرف"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    image: z.any(),
  })

  .superRefine(
    (value, ctx) => {
      const { password, confirmPassword } = value;
      if (password !== confirmPassword) {
        ctx.addIssue({
          message: "كلمة المرور وتأكيد كلمة المرور غير متطابقين",
          path: ["confirmPassword"],
        });
      }
    },
    {
      message: "الرجاء اختيار المنفذ الذي يتم العمل به",
    }
  );
