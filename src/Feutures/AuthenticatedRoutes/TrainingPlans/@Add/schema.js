import { z } from "zod";
export const exerciseSchema = z.object({
  exercise: z.any(),
  sets: z
    .number({ message: "الرجاء ادخال عدد المجاميع" })
    .min(0, { message: "لا يمكن ان يقل عن 0" }),
  reps: z
    .number({ message: "الرجاء ادخال عدد العدات" })
    .min(0, { message: "لا يمكن ان يقل عن 0" }),
  restBetweenSets: z
    .number({ message: "الرجاء ادخال وقت الراحة بين المجاميع " })
    .min(0, { message: "لا يمكن ان يقل عن 0" }),
  restBetweenExercises: z
    .number({ message: "الرجاء ادخال وقت الراحة بين العدات " })
    .min(0, { message: "لا يمكن ان يقل عن 0" }),
});
export const DayPlanSchema = z.object({
  dayTitle: z.any(),
  exercises: z
    .array(z.any())
    .min(1, { message: "الرجاء ادخال علاقل تمرين واحد فمخطط اليوم" })
    .max(8, {
      message: "عدد التمارين لا يمكن ان يتجاوز ال 8 تمارين الرجاء حذف البعض",
    }),
});
export const schema = z.object({
  title: z.string().min(1, { message: "الرجاء ادخال العنوان" }),
  description: z.string().min(1, { message: "الرجاء ادخال الوصف" }),
  days: z
    .array(z.any())
    .min(1, {
      message: "الرجاء ادخال مخطط اليوم الاول علاقل",
    })
    .max(6, { message: "عدد الايام لا يمكن ان يزيد عن 6 ايام" }),
  image: z.any(),
  targetGender: z.enum(["men", "women"], {
    message: "الرجاء اختيار الجنس المستهدف",
  }),
});
