import { z } from "zod";
const QuizOptionSchema = z.object({
  key: z.enum(["a", "b", "c", "d"]),
  value: z.string().trim().min(1, { message: "يجب إدخال قيمة الخيار" }),
});

const QuizQuestionSchema = z.object({
  question: z.string().trim().min(1, { message: "السؤال مطلوب" }),
  options: z
    .array(QuizOptionSchema)
    .length(4, { message: "يجب أن يحتوي كل سؤال على 4 خيارات" }),
  correctAnswer: z.enum(["a", "b", "c", "d"], {
    required_error: "يجب اختيار الإجابة الصحيحة",
    invalid_type_error: "يجب أن تكون الإجابة الصحيحة 'a', 'b', 'c', أو 'd'",
  }),
});

export const schema = z.object({
  questions: z
    .array(QuizQuestionSchema)
    .min(1, { message: "مطلوب سؤال واحد على الأقل" })
    .max(50, { message: "لا يُسمح بأكثر من 50 سؤالًا" }),
});
