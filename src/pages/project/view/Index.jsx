import {
  DescriptionOutlined,
  Person as SupervisorIcon,
} from "@mui/icons-material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NumbersIcon from "@mui/icons-material/Numbers";
import UpdateIcon from "@mui/icons-material/Update";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Fade,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResponsivePaperWrapper from "../../../components/table/ResponsivePaperWrapper";
import {
  getProjectbyId,
  getTasksByProject,
} from "../../../redux/slices/project/projectApi";
import { useDispatch } from "../../../redux/store";
import TableNoData from "../../../components/table/TableNoData";
import Iconify from "../../../components/iconify";

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [task, setTask] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(getProjectbyId(id)).then((response) => {
        console.log(project, response, "responssdsdssdse");
        if (response.payload && response.payload.success) {
          setProject(response.payload.project);
        }
        setLoading(false);
      });
      const fetchTasks = async () => {
        try {
          const res = await dispatch(getTasksByProject(id));
          console.log("fetchTasksres", res);
          if (res?.payload?.success) {
            setTask(res?.payload?.tasks);
          } else {
            toast.error("Failed to load tasks");
          }
        } catch (error) {
          toast.error("An error occurred while fetching tasks");
        }
      };
      fetchTasks();
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} thickness={5} color="primary" />
      </Box>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const fallback = (val) => val || "N/A";
  const isNotFound = !task?.length;
  console.log("tasjaksjkajsk", task);

  return (
    <Fade in>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh" }}>
        <ResponsivePaperWrapper>
          <Box className="w-full py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography variant="h5" fontWeight="bold">
              Project Details
            </Typography>
            <IconButton variant="outlined" onClick={() => navigate("/project")}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
        </ResponsivePaperWrapper>
        <Paper
          elevation={6}
          className="px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto "
        >
          <ResponsivePaperWrapper>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "linear-gradient(to right, #0963ac, #4c91f5)",
                borderRadius: "8px",
                padding: "16px",
                color: "white",
                width: "100%",
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {fallback(project?.name)}
                </Typography>
                <Typography variant="body2" component="span">
                  <Chip
                    label={project?.projectCode}
                    variant="outlined"
                    sx={{ color: "#f0f7f2" }}
                  />
                </Typography>
              </Box>
              <BusinessIcon sx={{ fontSize: "40px", color: "white" }} />
            </Box>
          </ResponsivePaperWrapper>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={12} md={12} sx={{ minWidth: "100%" }}>
              <Card
                fullWidth
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  minHeight: 180,
                  bgcolor: "#f8fafc",
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <SupervisorIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">Members</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography fontSize="1rem" color="text.primary">
                        {project?.members
                          ?.map((item) => item?.user?.name)
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <DescriptionOutlined sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">Decription</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography fontSize="1rem" color="text.primary">
                        {project?.description || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <NumbersIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">Status</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        label={project?.status || "Unknown"}
                        color={
                          project?.status === "Completed"
                            ? "success"
                            : "warning"
                        }
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <CalendarTodayIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">Start Date</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{formatDate(project?.startDate)}</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    mb: 1.5,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <UpdateIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">End Date</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{formatDate(project?.endDate)}</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.2,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={1}>
                      <AcUnitIcon sx={{ color: "#64748b" }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography fontWeight="bold">Due Date</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{formatDate(project?.dueDate)}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          sx={{ mt: "10px" }}
        >
          Task Details
        </Typography>
        <Paper
          elevation={6}
          className="px-2 sm:px-6 lg:px-8 py-8 max-w-9xl mx-auto mt-[10px] "
        >
          {Array.isArray(task) && (
            <Box>
              <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>
                        <strong>Sr.No</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Title</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Created By</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Assignee</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Due</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Description</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Activity</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {task.length > 0 ? (
                      task.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item?.title || "N/A"}</TableCell>
                          <TableCell>
                            {item?.createdBy?.name || "N/A"}
                          </TableCell>
                          <TableCell>{item?.assignee?.name || "N/A"}</TableCell>
                          <TableCell>
                            {formatDate(item?.dueDate) || "N/A"}
                          </TableCell>
                          <TableCell>{item?.status || "N/A"}</TableCell>
                          <TableCell>{item?.description || "-"}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 ,cursor:"pointer"}}  onClick={() =>
                                    navigate(`/project/task-activity/${item?._id}`, {
                                      state: { ...item, project },
                                    })
                                  }>
                              <Iconify icon="eva:eye-outline" />
                               
                                
                              </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableNoData isNotFound={isNotFound} />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Container>
    </Fade>
  );
};

export default Index;
