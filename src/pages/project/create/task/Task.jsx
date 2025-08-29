import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskValidationSchema } from "./validation";
import { useDispatch } from "../../../../redux/store";
import {
  createTask,
  editTask,
  getTasksByProject,
  findProject,
} from "../../../../redux/slices/project/projectApi";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  Box,
  Autocomplete,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import { toast } from "react-toastify";

const defaultValues = {
  projectId: null,
  title: "",
  description: "",
  dueDate: "",
  status: "Pending",
  assignedTo: null,
};

const TaskForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const taskId = id;

  console.log("taskId", id);

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const methods = useForm({
    resolver: yupResolver(taskValidationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const selectedProjectId = watch("projectId");

  // Load projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await dispatch(findProject());
        if (res?.payload?.success) {
          console.log("asjhajshahs", res);
          setProjects(res?.payload?.projects);
        } else {
          toast.error("Failed to load projects");
        }
      } catch {
        toast.error("Failed to load projects");
      }
    };
    fetchProjects();
  }, [dispatch]);

  // Load task data if editing
  useEffect(() => {
    if (isEdit) {
      dispatch(getTasksByProject(taskId)).then((res) => {
        if (res?.payload?.success) {
          const task = res?.payload.tasks;
          console.log("getTasksByProject", task);
          reset({
            projectId: task.project?._id || null,
            title: task.title,
            description: task.description || "",
            dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
            status: task.status || "Pending",
            assignedTo: task.assignedTo?._id || null,
          });
          if (task.project?.members) {
            setMembers(task.project.members);
          }
        } else {
          toast.error("Failed to load task data");
        }
      });
    }
  }, [isEdit, taskId, dispatch, reset]);

  // Load members when project changes
  useEffect(() => {
    if (selectedProjectId) {
      const project = projects.find((p) => p._id === selectedProjectId);
      if (project?.members) {
        setMembers(project.members);
        // If assignedTo not in members, reset assignedTo field
        const assignedToValue = watch("assignedTo");
        if (!project.members.some((m) => m.user._id === assignedToValue)) {
          reset(
            { ...methods.getValues(), assignedTo: null },
            { keepErrors: true, keepDirty: true, keepTouched: true }
          );
        }
      } else {
        setMembers([]);
        reset(
          { ...methods.getValues(), assignedTo: null },
          { keepErrors: true, keepDirty: true, keepTouched: true }
        );
      }
    } else {
      setMembers([]);
      reset(
        { ...methods.getValues(), assignedTo: null },
        { keepErrors: true, keepDirty: true, keepTouched: true }
      );
    }
  }, [selectedProjectId, projects, reset, watch, methods]);

  const onSubmit = async (data) => {
    console.log("sdshdskhdisdh", data);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: data.status,
        assignee: data.assignedTo,
        project: data.projectId,
      };

      const action = isEdit
        ? editTask({ taskId, data: payload })
        : createTask(payload);
      const response = await dispatch(action);

      if (response.payload?.success) {
        toast.success(isEdit ? "Task updated!" : "Task created!");
        navigate(`/project`);
      } else {
        toast.error(response.payload?.message || "Task operation failed");
      }
    } catch (error) {
      toast.error(error.message || "Error submitting form");
    }
  };

  return (
    <Container maxWidth="2xl" sx={{ minHeight: "100vh", py: 6 }}>
      <Card sx={{ p: 4, background: theme.palette.background.default }}>
        <Typography variant="h5" mb={3}>
          {isEdit ? "Edit Task" : "Create New Task"}
        </Typography>
            <Card sx={{ p: 3 }}>
        <FormProvider {...methods}>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>

              <Box display="grid" gap={3} gridTemplateColumns="1fr 1fr" mb={3}>
                {/* Row 1: Select Project, Assign To */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={projects}
                        getOptionLabel={(option) => option.name || ""}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value
                        }
                        onChange={(e, value) =>
                          field.onChange(value?._id || null)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Project"
                            error={!!errors.projectId}
                            helperText={errors.projectId?.message}
                            required
                          />
                        )}
                        value={projects.find((p) => p._id === field.value) || null}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="assignedTo"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={members.map((m) => m.user)}
                        getOptionLabel={(option) => option.name || ""}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value
                        }
                        onChange={(e, value) =>
                          field.onChange(value?._id || null)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Assign To"
                            error={!!errors.assignedTo}
                            helperText={errors.assignedTo?.message}
                            required
                          />
                        )}
                        value={
                          members.find((m) => m.user._id === field.value)?.user || null
                        }
                        fullWidth
                        disabled={!selectedProjectId}
                      />
                    )}
                  />
                </Grid>
                {/* Row 2: Title, Due Date */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Task Title"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
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
                        required
                      />
                    )}
                  />
                </Grid>
                {/* Row 3: Description, Status */}
                <Grid item xs={12} md={6}>
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
                </Grid>
                <Grid item xs={12} md={6}>
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
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Delayed">Delayed</option>
                      </TextField>
                    )}
                  />
                </Grid>
                {/* Submit Button Row */}
              </Box>

                <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                  <Button variant="outlined" onClick={() => navigate("/project")}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isEdit ? "Update Task" : "Create Task"}
                  </Button>
                </Box>

          </form>
        </FormProvider>
            </Card>
      </Card>
    </Container>
  );
};

export default TaskForm;
