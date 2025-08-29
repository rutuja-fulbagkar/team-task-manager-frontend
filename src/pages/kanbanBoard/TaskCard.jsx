import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Card, Typography, Box, IconButton } from "@mui/material";
import capitalizeFirst from "../../utils/capitalize";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskCard = ({ task, index, onDeleteTask }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: snapshot.isDragging ? "#d4d4d4ff" : "white",
            cursor: "grab",
            position: "relative",  // Add this line!
          }}
        >
          <Typography variant="subtitle1">{capitalizeFirst(task?.title)}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {capitalizeFirst(task?.description)}
          </Typography>
          <Box mt={1} fontSize="0.8rem" color="text.secondary">
            <strong> Due:</strong> {task.dueDate ? task.dueDate.substring(0, 10) : "N/A"}
          </Box>
          <IconButton
            aria-label={`Delete task ${task.title}`}
            onClick={() => onDeleteTask(task._id, task.status)}
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              color: "#ef5350",
              backgroundColor: "#ffebee",
              "&:hover": { backgroundColor: "#ffcdd2" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
