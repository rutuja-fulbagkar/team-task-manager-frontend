import { AccessTime, Add, Delete, Edit, FileCopy, Group, Settings } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { activitiesTaskbyId } from "../../../redux/slices/project/projectApi";

const getIconByAction = (action) => {
  switch (action.toLowerCase()) {
    case "created":
      return {
        icon: Add,
        type: "creation",
        color: "success.main",
        bg: "#d7f5d2",
        border: "#a1d890",
      };
    case "updated":
      return {
        icon: Edit,
        type: "update",
        color: "info.main",
        bg: "#d2e4f7",
        border: "#90b4da",
      };
    case "deleted":
    case "removed":
      return {
        icon: Delete,
        type: "deletion",
        color: "error.main",
        bg: "#fbb6b6",
        border: "#f97878",
      };
    case "members":
    case "team":
      return {
        icon: Group,
        type: "collaboration",
        color: "secondary.main",
        bg: "#e3d2f7",
        border: "#b89def",
      };
    case "file":
    case "attachments":
      return {
        icon: FileCopy,
        type: "file",
        color: "primary.main",
        bg: "#cad8f7",
        border: "#92a9de",
      };
    case "settings":
      return {
        icon: Settings,
        type: "settings",
        color: "text.secondary",
        bg: "#e0e0e0",
        border: "#bcbcbc",
      };
    default:
      return {
        icon: Edit,
        type: "update",
        color: "info.main",
        bg: "#d2e4f7",
        border: "#90b4da",
      };
  }
};

const TaskActivity = () => {
  const { id: taskId } = useParams();
  const dispatch = useDispatch();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await dispatch(activitiesTaskbyId(taskId)).unwrap();
        if (response.success) {
          setActivities(response.activities || []);
        } else {
          setError("Failed to load activities");
        }
      } catch (err) {
        setError("Failed to fetch activities");
      } finally {
        setLoading(false);
      }
    };
    if (taskId) fetchActivities();
  }, [dispatch, taskId]);

  if (loading) return <Typography align="center" sx={{ p: 4 }}>Loading...</Typography>;

  if (error) return <Typography color="error" align="center" sx={{ p: 4 }}>{error}</Typography>;

  if (activities.length === 0)
    return <Typography align="center" sx={{ p: 4 }}>No activity found for this task.</Typography>;

  return (
    <Card sx={{ p: 2, maxWidth:"2xl", margin: "20px auto" }}>
      <CardContent>
        {activities.map(({ _id, action, description, user, createdAt }) => {
          const { icon: Icon, type, color, bg, border } = getIconByAction(action);
          const userInitials = user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <Box
              key={_id}
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: `1px solid ${border}`,
                backgroundColor: bg,
                boxShadow: 1,
                alignItems: "flex-start",
              }}
            >
              <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
                <Icon />
              </Avatar>

              <Box flex="1">
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                  <Badge
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1, fontSize: 12, p: "2px 6px", verticalAlign: "middle" }}
                  >
                    {type}
                  </Badge>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {description}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 12, color: "text.secondary" }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.main", fontSize: 14 }}>
                    {userInitials}
                  </Avatar>
                  <Typography>{user.name}</Typography>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <AccessTime sx={{ fontSize: 16 }} />
                  <Typography>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TaskActivity;
