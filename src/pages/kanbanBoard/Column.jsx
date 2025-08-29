import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Typography, Paper, Box } from "@mui/material";

const Column = ({ status, tasks, bgColor, onDeleteTask }) => {
  return (
    <Paper sx={{ width: 300, minHeight: 500, p: 2, backgroundColor: bgColor,}}>
      <Typography variant="h6" mb={2}>
        {status}
      </Typography>
      <Droppable droppableId={status}>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ minHeight: 400 }}
          >
            {(tasks || []).map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} onDeleteTask={onDeleteTask} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};

export default Column;
