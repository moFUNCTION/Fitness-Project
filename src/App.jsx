import { Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy } from "react";
import { LazyPageWrapper } from "./Components/Common/LazyPageWrapper/LazyPageWrapper";
import { useAuth } from "./Context/UserDataContextProvider/UserDataContextProvder";
import { ProtectedRoute } from "./Utils/ProtectedRoute/ProtectedRoute";
// Error Page
const ErrorPage = lazy(() => import("./Components/Layout/ErrorPage/ErrorPage"));
// Auth
const Register = lazy(() => import("./Feutures/Auth/Register/Index"));
const Login = lazy(() => import("./Feutures/Auth/Login/Index"));
// Main Routes
const Main = lazy(() => import("./Feutures/AuthenticatedRoutes/Index"));
// User Profile Route
const UserProfile = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/UserProfile/Index")
);
const UpdateUserProfileData = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/UpdateUserData/Index")
);
// Tools And Machines
const ToolsAndMachines = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/ToolsAndMachines/@View/Index")
);
// Body Parts
const BodyParts = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/BodyParts/@View/Index")
);
// Deep anatomy
const DeepAnatomy = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/DeepAnatomy/@View/Index")
);
// Exercises
const AddExercise = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Exercises/@Add/Index")
);
const Exercises = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Exercises/@View/Index")
);
const Exercise = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Exercises/@View_Id/Index")
);
// Meals Categories
const MealsCategories = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/MealsCategories/@View/Index")
);
// Courses
const AddCourse = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Courses/@Add/Index")
);
const Courses = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Courses/@View/Index")
);
const Course = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Courses/@View_Id/Index")
);
const CourseUpdate = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Courses/@Update/Index")
);
const CourseLessons = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Courses/__Nested/Lessons/Index")
);
const CourseLessonAdd = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Courses/__Nested/AddLesson/Index")
);

const CourseQuizes = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Courses/__Nested/Quiz/Index")
);
const CourseQuizAdd = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Courses/__Nested/AddQuiz/Index")
);
const CourseQuizUpdate = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Courses/__Nested/UpdateQuiz/Index")
);
const TrainingPlans = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/TrainingPlans/@View/Index")
);
const TrainingPlan = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/TrainingPlans/@View_Id/Index")
);
const AddTrainingPlan = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/TrainingPlans/@Add/Index")
);
const UpdateTrainingPlan = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/TrainingPlans/@Update/Index")
);
const Discounts = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Discounts/@View/Index")
);
const AddMealCalculation = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/MealsCalculation/@Add/Index")
);
const MealsCalculation = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/MealsCalculation/@View/Index")
);
const UpdateMealCalculation = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/MealsCalculation/@Update/Index")
);
const Supplements = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Supplements/@View/Index")
);
const AddSupplement = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Supplements/@Add/Index")
);
const Supplement = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Supplements/@View_Id/Index")
);
const UpdateSupplement = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Supplements/@Update/Index")
);
const Vitaments = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Vitements/@View/Index")
);
const Vitament = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Vitements/@View_Id/Index")
);
const AddVitament = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Vitements/@Add/Index")
);
const UpdateVitament = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Vitements/@Update/Index")
);
const Users = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Users/@View/Index")
);
const TrainerRequests = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/TrainerRequests/@View/Index")
);
const TrainerRequest = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/TrainerRequests/@View_Id/Index")
);
const Trash = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Trash/@View/Index")
);
const Chats = lazy(() => import("./Feutures/AuthenticatedRoutes/Chats/Index"));
const ChatMessages = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Chats/__Nested/Chat.messages")
);
const AddChat = lazy(() =>
  import("./Feutures/AuthenticatedRoutes/Chats/__Nested/AddChat")
);
function App() {
  const { user } = useAuth();
  return (
    <>
      <LazyPageWrapper>
        <Routes>
          <Route
            path="/register"
            element={
              <ProtectedRoute
                condition={!user.data}
                navigate={{
                  to: "/",
                  message: "لقد سجلت الدخول بالفعل",
                }}
              >
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute
                condition={!user.data}
                navigate={{
                  to: "/",
                  message: "لقد سجلت الدخول بالفعل",
                }}
              >
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                condition={user.data}
                navigate={{
                  to: "/login",
                  message: "الرجاء تسجيل الدخول",
                }}
              >
                <Main />
              </ProtectedRoute>
            }
          >
            <Route
              path="*"
              element={
                <ErrorPage
                  errorMessage="خطأ في العثور علي تلك الصفحة"
                  navigateTo="/"
                />
              }
            />
            <Route index element={<UserProfile />} />
            <Route path="user" element={<UserProfile />} />
            <Route path="user/update" element={<UpdateUserProfileData />} />
            <Route path="tools" element={<ToolsAndMachines />} />
            <Route path="deepAnatomy" element={<DeepAnatomy />} />
            <Route path="body-parts" element={<BodyParts />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="exercises/:id" element={<Exercise />} />
            <Route path="exercises/add" element={<AddExercise />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/add" element={<AddCourse />} />
            <Route path="courses/update/:id" element={<CourseUpdate />} />

            <Route path="courses/:courseId" element={<Course />}>
              <Route
                path="*"
                element={
                  <ErrorPage
                    errorMessage="خطأ في العثور علي تلك الصفحة"
                    navigateTo="/"
                  />
                }
              />
              <Route index element={<CourseLessons />} />
              <Route path="lessons" element={<CourseLessons />} />
              <Route path="lessons/add" element={<CourseLessonAdd />} />
              <Route path="lessons/update" element={<CourseLessonAdd />} />
              <Route path="quizes" element={<CourseQuizes />} />
              <Route path="quizes/add" element={<CourseQuizAdd />} />
              <Route path="quizes/update/:id" element={<CourseQuizUpdate />} />
            </Route>

            <Route path="courses/categories" />

            <Route path="meals/categories" element={<MealsCategories />} />
            <Route path="training-plans" element={<TrainingPlans />} />
            <Route path="training-plans/add" element={<AddTrainingPlan />} />
            <Route path="training-plans/:id" element={<TrainingPlan />} />
            <Route
              path="training-plans/:id/update"
              element={<UpdateTrainingPlan />}
            />
            <Route path="discounts" element={<Discounts />} />
            <Route path="meals-calculation" element={<MealsCalculation />} />
            <Route
              path="meals-calculation/add"
              element={<AddMealCalculation />}
            />
            <Route
              path="meals-calculation/:id/update"
              element={<UpdateMealCalculation />}
            />
            <Route path="supplements" element={<Supplements />} />
            <Route path="supplements/add" element={<AddSupplement />} />
            <Route
              path="supplements/:id/update"
              element={<UpdateSupplement />}
            />
            <Route path="supplements/:id" element={<Supplement />} />
            <Route path="vitaments" element={<Vitaments />} />
            <Route path="vitaments/add" element={<AddVitament />} />
            <Route path="vitaments/:id" element={<Vitament />} />
            <Route path="vitaments/:id/update" element={<UpdateVitament />} />
            <Route path="users" element={<Users />} />
            <Route path="trainer-requests" element={<TrainerRequests />} />
            <Route path="trainer-requests/:id" element={<TrainerRequest />} />
            <Route path="trash" element={<Trash />} />
            <Route path="chat" element={<Chats />}>
              <Route path=":id" element={<ChatMessages />} />
              <Route path="add/group" element={<AddChat />} />
            </Route>
          </Route>
        </Routes>
      </LazyPageWrapper>
    </>
  );
}

export default App;
