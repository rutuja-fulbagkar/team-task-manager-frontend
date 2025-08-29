import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../authGuards/ProtectedRoute";
import PublicRoute from "../authGuards/PublicRoute";
import PageNotFound from "../components/common/PageNotFound";
import Login from "../pages/authentication/Login";
import Signup from "../pages/authentication/SignUp";
import Verify from "../pages/authentication/Verify";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../pages/MainLayout";
import {
  ProjectAddPage,
  ProjectPage,
  ProjectViewPage
} from "./element";
import TaskForm from "../pages/project/create/task/Task";
import KanbanBoard from "../pages/kanbanBoard/KanbanBoard";
import TaskActivity from "../pages/project/view/TaskActivity";

function Routerjs() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>

        }
      />
  <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
          
        }
      />
        <Route
        path="/verify"
        element={
          <PublicRoute>
            <Verify />
          </PublicRoute>
          
        }
      />
      {/* Protected routes with MainLayout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<ProjectPage />} />
       <Route path="project">
          <Route index element={<ProjectPage />} />
          <Route path="new" element={<ProjectAddPage />} />
          <Route path="kanban/:id" element={<KanbanBoard />} />
          <Route path="task-activity/:id" element={<TaskActivity />} />
          <Route path="new-task" element={<TaskForm />} />
          <Route path=":id/edit" element={<TaskForm />} />
          <Route path="edit/:id" element={<ProjectAddPage />} />
          <Route path="view/:id" element={<ProjectViewPage />} />
        </Route>
       
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Routerjs;
