import * as Yup from "yup";

export const taskValidationSchema = Yup.object().shape({
  projectId: Yup.string().required("Project is required"),
  assignedTo: Yup.string().required("Assignee is required"),
  title: Yup.string()
    .trim()
    .required("Task title is required"),
  description: Yup.string()
    .trim()
    .required("Description is required"),
  dueDate: Yup.date()
    .required("Due Date is required")
    .typeError("Invalid date"),
  status: Yup.string()
    .oneOf(["Pending", "InProgress", "Completed", "Delayed"], "Invalid status")
    .required("Status is required"),
});
