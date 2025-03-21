import { CiUser } from "react-icons/ci";
import {
  MdAdsClick,
  MdContactMail,
  MdFacebook,
  MdPassword,
  MdPolicy,
  MdQuiz,
} from "react-icons/md";
import { GiMuscleUp } from "react-icons/gi";
import { IoIosBody } from "react-icons/io";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { BiChat, BiSolidCategory, BiTrash } from "react-icons/bi";
import { MdDiscount } from "react-icons/md";
import { GiMedicinePills } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { TbAwardFilled } from "react-icons/tb";
export const TabsValues = [
  {
    title: "الحساب",
    Icon: CiUser,
    href: "/user",
  },
  {
    title: "تغيير الرقم السري",
    Icon: MdPassword,
    href: "/user",
  },
  {
    title: "الادوات والمعدات الرياضية",
    Icon: GiMuscleUp,
    href: "/tools",
  },
  {
    title: "اجزاء الجسم",
    Icon: IoIosBody,
    href: "/body-parts",
  },
  {
    title: "التشريحات العميقة",
    Icon: IoIosBody,
    href: "/deepAnatomy",
  },
  {
    title: "التمارين",
    Icon: MdOutlineSportsGymnastics,
    href: "/exercises",
  },
  {
    title: "الكورسات",
    Icon: MdOutlineVideoLibrary,
    childsLinks: [
      {
        title: "الكورسات",
        Icon: MdOutlineVideoLibrary,
        href: "/courses",
      },
      {
        title: "تصنيفات الكورسات",
        Icon: BiSolidCategory,
        href: "/courses/categories",
      },
    ],
  },
  {
    title: "تصنيفات الوجبات",
    Icon: GiMeal,
    href: "/meals/categories",
  },
  {
    title: "الوجبات",
    Icon: GiMeal,
    href: "/meals-calculation",
  },
  {
    title: "الوجبات الرئيسية",
    Icon: GiMeal,
    href: "/meals",
  },
  {
    title: "خطط التمرين",
    Icon: MdOutlineSportsGymnastics,
    href: "/training-plans",
  },
  {
    title: "المكملات الغذائية",
    Icon: GiMedicinePills,
    href: "/supplements",
  },
  {
    title: "الفيتامينات",
    Icon: GiMedicinePills,
    href: "/vitaments",
  },
  {
    title: "الخصومات",
    Icon: MdDiscount,
    href: "/discounts",
  },
  {
    title: "المستخدمين",
    Icon: FaUsers,
    href: "/users",
  },
  {
    title: "طلبات انضمام المدربين",
    Icon: FaUsers,
    href: "/trainer-requests",
  },
  {
    title: "سلة المهملات",
    Icon: BiTrash,
    childsLinks: [
      {
        title: "الادوات والمعدات الرياضية",
        Icon: BiTrash,
        href: "/trash?search=toolOrMachine",
      },
      {
        title: "اجزاء الجسم",
        Icon: BiTrash,
        href: "/trash?search=bodyParts",
      },
      {
        title: "التشريحات العميقة",
        Icon: BiTrash,
        href: "/trash?search=deepAnatomy",
      },
      {
        title: "التمارين",
        Icon: BiTrash,
        href: "/trash?search=exercises",
      },
      {
        title: "الكورسات",
        Icon: BiTrash,
        href: "/trash?search=courses",
      },
      {
        title: "تصنيفات الوجبات",
        Icon: BiTrash,
        href: "/trash?search=mealsCategory",
      },
      {
        title: "الوجبات",
        Icon: BiTrash,
        href: "/trash?search=mealsCalculation",
      },

      {
        title: "خطط التمرين",
        Icon: BiTrash,
        href: "/trash?search=trainingPlan",
      },
      {
        title: "المكملات الغذائية",
        Icon: BiTrash,
        href: "/trash?search=supplements",
      },
      {
        title: "الفيتامينات",
        Icon: BiTrash,
        href: "/trash?search=vitaments",
      },
      {
        title: "الخصومات",
        Icon: BiTrash,
        href: "/trash?search=discounts",
      },
      {
        title: "المستخدمين",
        Icon: BiTrash,
        href: "/trash?search=users",
      },
      {
        title: "طلبات انضمام المدربين",
        Icon: BiTrash,
        href: "/trash?search=trainerRequests",
      },
    ],
  },
  {
    title: "المحادثات",
    Icon: BiChat,
    href: "/chat",
  },
  {
    title: "الاعلانات",
    Icon: MdAdsClick,
    href: "/ads",
  },
  {
    title: "مواقع التواصل الاجتماعي",
    Icon: MdFacebook,
    href: "/social-links",
  },
  {
    title: "شروط الاستخدام",
    Icon: MdPolicy,
    href: "/polices",
  },
  {
    title: "جهات التواصل",
    Icon: MdContactMail,
    href: "/contact-us",
  },
  {
    title: "جوائز",
    Icon: TbAwardFilled,
    href: "/prizes",
  },
];
