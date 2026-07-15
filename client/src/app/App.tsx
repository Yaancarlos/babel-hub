import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "../auth/Route.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// import Login from "../pages/auth/login.tsx";
import BlockUi from "../pages/misc/blockUi.tsx";
import TeacherDashboard from "../pages/teacher/dashboard/TeacherDashboard.tsx";
import PrincipalDashboard from "../pages/principal/dashboard/PrincipalDashboard.tsx";
import NotFoundPage from "../pages/misc/notFoundPage.tsx";
import PrincipalLayout from "../pages/principal/PrincipalLayout.tsx";
import Community from "../pages/principal/community/Community.tsx";
import TeacherLayout from "../pages/teacher/TeacherLayout.tsx";
import NotificationCenter from "../pages/principal/notifications/NotificationCenter.tsx";
import AttendanceCenter from "../pages/principal/notifications/attendance/Attendance.tsx";
import StudentLayout from "../pages/student/StudentLayout.tsx";
import StudentDashboard from "../pages/student/dashboard/StudentDashboard.tsx";
import Students from "../pages/principal/community/students/Students.tsx";
import Teachers from "../pages/principal/community/teachers/Teachers.tsx";
import TeacherProfile from "../pages/principal/community/teachers/TeacherProfile.tsx";
import StudentProfile from "../pages/principal/community/students/StudentProfile.tsx";
import Courses from "../pages/principal/courses/Courses.tsx";
import CourseDetails from "../pages/principal/courses/CourseDetails.tsx";
import Setup from "../pages/principal/files/Setup.tsx";
import Details from "../pages/principal/files/areas/Details.tsx";
import TeacherClasses from "../pages/teacher/courses/Classes.tsx";
import ClassesDetails from "../pages/principal/courses/classes/ClassesDetails.tsx";
import ClassDetails from "../pages/teacher/courses/ClassDetails.tsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#333333',
                        borderRadius: '8px',
                    },
                    success: {
                        style: {
                            background: '#ffffff',
                            color: '#333333'
                        },
                    },
                    error: {
                        style: {
                            background: '#ffffff',
                            color: '#333333'
                        },
                    },
                }}
            />

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <Navigate to="/updating-babel" replace /> } />
                    <Route path="/updating-babel" element={ <BlockUi /> } />
                    <Route path="/login" element={ <BlockUi /> } />

                    <Route
                        path="/principal"
                        element={
                            <ProtectedRoute>
                                <PrincipalLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" index element={<PrincipalDashboard />} />

                        <Route path="cursos" element={<Courses />}>
                            <Route path=":id" element={<CourseDetails />} />
                            <Route path=":courseId/clase/:id" element={<ClassesDetails />} />
                        </Route>

                        <Route path="comunidad" element={<Community />} />
                        <Route path="comunidad/profesores" element={<Teachers />} />
                        <Route path="comunidad/profesores/:id" element={<TeacherProfile />} />
                        <Route path="comunidad/estudiantes" element={<Students />} />
                        <Route path="comunidad/estudiantes/:id" element={<StudentProfile />} />

                        <Route path="formatos" element={<Setup />} />
                        <Route path="formatos/areas/:areaId" element={<Details />} />

                        <Route path="notificaciones" element={<NotificationCenter />} />
                        <Route path="notificaciones/asistencia" element={<AttendanceCenter />} />

                    </Route>

                    <Route
                        path="/teacher"
                        element={
                            <ProtectedRoute>
                                <TeacherLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" index element={<TeacherDashboard />}/>

                        <Route path="clases" element={<TeacherClasses />}>
                            <Route path=":id" element={<ClassDetails />}/>
                        </Route>
                    </Route>

                    <Route
                        path="/student"
                        element={
                            <ProtectedRoute>
                                <StudentLayout />
                            </ProtectedRoute>

                        }
                    >
                        <Route path="dashboard" index element={<StudentDashboard />}/>
                    </Route>


                    { /* Not Found Pages section */ }
                    <Route
                        path="*"
                        element={
                            <NotFoundPage />
                        }
                    />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App;