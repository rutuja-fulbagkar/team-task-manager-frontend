import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import { getTasksByProject, editTask, deleteTaskbyId } from "../../redux/slices/project/projectApi";
import { useDispatch } from "../../redux/store";
import { useParams } from "react-router-dom";
import { Box, Card, CircularProgress, Container, Typography } from "@mui/material";
import { toast } from "react-toastify";
import TableNoData from "../../components/table/TableNoData";
import { useTheme } from "@mui/material/styles";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";


const statusColors = {
  Pending: "#ffeb3ba8",
  InProgress: "#42a4f56c",
  Completed: "#66bb6aa6",
  Delayed: "#ef5350f1",
};

const KanbanBoard = () => {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [task, setTask] = useState([]);
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await dispatch(getTasksByProject(id));
      if (res?.payload?.success) {
        setTask(res.payload.tasks);
      } else {
        toast.error("Failed to load tasks");
        setTask([]);
      }
    } catch (error) {
      toast.error("An error occurred while fetching tasks");
      setTask([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [dispatch, id]);

  // Group tasks by status whenever tasks change
  useEffect(() => {
    if (task && task.length > 0) {
      const grouped = task.reduce((acc, t) => {
        const status = t.status || "Pending";
        if (!acc[status]) acc[status] = [];
        acc[status].push(t);
        return acc;
      }, {});
      setColumns(grouped);
    } else {
      setColumns({});
    }
  }, [task]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      const sourceTasks = Array.from(newColumns[source.droppableId]);
      const destTasks =
        source.droppableId === destination.droppableId
          ? sourceTasks
          : Array.from(newColumns[destination.droppableId] || []);

      const [movedTask] = sourceTasks.splice(source.index, 1);
      const updatedTask = { ...movedTask, status: destination.droppableId };
      destTasks.splice(destination.index, 0, updatedTask);

      newColumns[source.droppableId] = sourceTasks;
      newColumns[destination.droppableId] = destTasks;

      return newColumns;
    });

    try {
      await dispatch(
        editTask({
          taskId: draggableId,
          data: { status: destination.droppableId },
        })
      ).unwrap();
      toast.success("Task status updated");
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId, status) => {
    try {
      const res = await dispatch(deleteTaskbyId(taskId)).unwrap();
      console.log("sjdhsjhdusd", res);
      if (res?.success) {
        toast.success(res?.message);
        await fetchTasks();
      }
      setColumns((prevColumns) => {
        const updatedTasks = prevColumns[status].filter((task) => task.id !== taskId);
        return {
          ...prevColumns,
          [status]: updatedTasks,
        };
      });
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={5} color="primary" />
      </Box>
    );
  }

  const isNotFound =
    !columns ||
    Object.keys(columns).length === 0 ||
    Object.values(columns).every((tasks) => tasks.length === 0);


  return (
    <Box className="w-full sm:px-6 lg:px-8 max-w-9xl  mx-auto  pb-0">
      <ResponsivePaperWrapper>
        <Box className="w-full  py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Typography
            variant="h5"
            fontWeight="bold"
            className="libre-baskerville-regular !text-[35px] "
          >
            Task Board
          </Typography>

        </Box>
      </ResponsivePaperWrapper>
      <Container maxWidth="2xl" sx={{ minHeight: "100vh"}}>
        <Card sx={{background: theme.palette.background.default }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: "flex", gap: 16, padding: 16, overflowX: "auto" }}>
              {Object.entries(columns).map(([status, tasks]) => (
                <Column
                  key={status}
                  status={status}
                  tasks={tasks}
                  bgColor={statusColors[status] || "#E0E0E0"}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
              <TableNoData isNotFound={isNotFound} />
            </div>
          </DragDropContext>
        </Card>
      </Container>
    </Box>
  );
};

export default KanbanBoard;
