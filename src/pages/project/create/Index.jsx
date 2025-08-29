import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  createProject,
  editProject,
  getProjectbyId,
  getAllUsers,
  addMembers,
} from "../../../redux/slices/project/projectApi";
import { useDispatch } from "../../../redux/store";

const schema = Yup.object().shape({
  projectCode: Yup.string()
    .trim()
    .required("Project code is required")
    .max(50, "Max 50 characters"),
  name: Yup.string()
    .trim()
    .required("Project name is required")
    .max(100, "Max 100 characters"),
  description: Yup.string().trim().max(500, "Max 500 characters"),
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date cannot be before start date")
    .typeError("End date is required"),
  dueDate: Yup.date()
    .min(Yup.ref("startDate"), "Due date cannot be before start date")
    .typeError("Due date must be a valid date"),
  status: Yup.string()
    .oneOf(["Pending", "InProgress", "Completed", "Delayed"], "Invalid status")
    .required("Status is required"),
});

const defaultValues = {
  projectCode: "",
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  dueDate: "",
  status: "Pending",
};

const ProjectForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [existingMembers, setExistingMembers] = useState([]);
  const [addingMember, setAddingMember] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  // Fetch project data if editing
  useEffect(() => {
    if (isEditMode) {
      dispatch(getProjectbyId(id)).then((res) => {
        if (res.payload?.success) {
          const p = res.payload.project;
          reset({
            projectCode: p.projectCode,
            name: p.name,
            description: p.description || "",
            startDate: p.startDate ? p.startDate.substring(0, 10) : "",
            endDate: p.endDate ? p.endDate.substring(0, 10) : "",
            dueDate: p.dueDate ? p.dueDate.substring(0, 10) : "",
            status: p.status || "Pending",
          });
          setExistingMembers(p.members || []);
        } else {
          toast.error("Failed to load project data");
        }
        setLoading(false);
      });
    }
  }, [id, isEditMode, dispatch, reset]);

  // Fetch all users excluding existing members
  useEffect(() => {
    if (isEditMode) {
      async function fetchUsers() {
        try {
          const res = await dispatch(getAllUsers());
          if (res?.payload?.success) {
            const allUsers = res?.payload?.users|| []; 
            console.log("hsjhshdsd", allUsers);
            const filtered = allUsers.filter(
              (u) => !existingMembers.some((m) => m.user._id === u._id)
            );
            setUsers(filtered);
          } else {
            toast.error("Failed to load users for adding member");
          }
        } catch (err) {
          toast.error("Failed to load users for adding member");
        }
      }
      fetchUsers();
    }
  }, [existingMembers, dispatch, isEditMode]);

  // Handle form submission for project create/edit
  const onSubmit = async (data) => {
    try {
      let response;
      if (isEditMode) {
        response = await dispatch(editProject({ paramsId: id, data }));
      } else {
        response = await dispatch(createProject(data));
      }
      if (response?.payload?.success) {
        navigate("/project");
      } else {
        throw new Error(response.payload?.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message || "Error submitting form");
    }
  };

  // Handle adding member to existing project
  const handleAddMember = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }
    setAddingMember(true);
    try {
      const payload = { projectId: id, userId: selectedUser._id, role: "member" };
      const res = await dispatch(addMembers(payload));

      if (res.payload && res.payload.success) {
        toast.success("Member added successfully");
        setSelectedUser(null);
        setExistingMembers(res.payload.project.members || []);
        // Refresh users by filtering out newly added member
        setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
      } else {
        toast.error(res.payload?.message || "Failed to add member");
      }
    } catch (err) {
      toast.error(err.message || "Failed to add member");
    }
    setAddingMember(false);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="2xl" sx={{ minHeight: "100vh", py: 6 }}>
      <Card sx={{ p: 4, background: theme.palette.background.default }}>
        <Typography variant="h5" mb={3}>
          {isEditMode ? "Edit Project" : "Create New Project"}
        </Typography>
        <FormProvider {...methods}>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Box display="grid" gap={3} gridTemplateColumns="1fr 1fr" mb={3}>
              {isEditMode && (
                <>
                  <Autocomplete
                    options={users}
                    getOptionLabel={(option) => `${option.name} (${option.email})`}
                    value={selectedUser}
                    onChange={(e, newValue) => setSelectedUser(newValue)}
                    renderInput={(params) => <TextField {...params} label="Select Member" />}
                    sx={{ width: 300 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddMember}
                    disabled={addingMember}
                    sx={{ alignSelf: "center" }}
                  >
                    {addingMember ? "Adding..." : "Add Member"}
                  </Button>
                </>
              )}
              {/* Project Code */}
              <Controller
                name="projectCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project Code"
                    error={!!errors.projectCode}
                    helperText={errors.projectCode?.message}
                    fullWidth
                  />
                )}
              />
              {/* Project Name */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                  />
                )}
              />
              {/* Description */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                  />
                )}
              />
              {/* Status */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    SelectProps={{ native: true }}
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    fullWidth
                  >
                    <option value="Pending">Pending</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </TextField>
                )}
              />
              {/* Start Date */}
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                    fullWidth
                  />
                )}
              />
              {/* End Date */}
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                    fullWidth
                  />
                )}
              />
              {/* Due Date */}
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Due Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dueDate}
                    helperText={errors.dueDate?.message}
                    fullWidth
                  />
                )}
              />
            </Box>
            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => navigate("/project")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Card>
    </Container>
  );
};

export default ProjectForm;
