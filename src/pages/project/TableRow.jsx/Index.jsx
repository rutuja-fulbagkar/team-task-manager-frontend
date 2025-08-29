import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  styled,
  Typography
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import PropTypes from "prop-types";
import { useState } from "react";
import { AiTwotoneSchedule } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../../../components/confirm-dialog";
import Iconify from "../../../components/iconify";
import MenuPopover from "../../../components/menu-popover/MenuPopover";
import { editProject, findProject } from "../../../redux/slices/project/projectApi";
import { useSelector } from "../../../redux/store";

const statusOptions = ["Pending", "InProgress", "Completed", "Delayed"];

 

const StatusCircle = styled("div")(({ color }) => ({
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  backgroundColor: color,
  display: "inline-block",
  marginRight: "8px",
}));

const Index = ({ row, isItemSelected, onDeleteRow, isLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
     const user = useSelector((state) => state.auth.user);
    
      console.log("objectytsas",user);
  const [openServiceScheduleDialog, setOpenServiceScheduleDialog] =
    useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    row?.status || "Pending"
  );
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event, _) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (newStatus !== selectedStatus) {
      setSelectedStatus(newStatus);

      const data = {
        paramsId: row?._id,
        data: { status: newStatus },
      };

      try {
        const response = await dispatch(editProject(data));

        if (response?.payload?.success) {
          console.log("sdsjkdskdksd",response);
          await dispatch(findProject());
        }  
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

 

  const StyledSelect = styled(Select)(({ theme }) => ({
    height: "40px",
    fontSize: "14px",
    "& .MuiSelect-select": {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  }));

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        sx={{ cursor: "pointer" }}
      >
        <TableCell>&nbsp;</TableCell>
        <TableCell
          sx={{
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate(`/project/view/${row?._id}`)}
        >
          <Box>
            <Typography variant="body2">{row?.projectCode}</Typography>
            {row?.serviceScheduled && (
              <Chip
                label="Service Scheduled"
                size="small"
                sx={{
                  mt: 0.5,
                  padding: "2px 6px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  height: "auto",
                  minWidth: "auto",
                  color: "#fff",
                  backgroundColor: "#223a4a",
                }}
              />
            )}
          </Box>
        </TableCell>

        <TableCell>
          {row?.name || "-"}
        </TableCell>
        <TableCell>
          {row?.members.length || "-"}
        </TableCell>
        
        <TableCell>
          {row?.dueDate
            ? moment(row.dueDate).format("DD/MM/YYYY")
            : "-"}
        </TableCell>
        {user?.role === "owner" ?
          (<TableCell>
            <FormControl fullWidth>
              <StyledSelect
                value={selectedStatus}
                onChange={handleStatusChange}
                displayEmpty
                disabled={isLoading || row?.status === "Completed"}
                inputProps={{ "aria-label": "Without label" }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Box display="flex" alignItems="center">
                      <StatusCircle
                        color={
                          status === "Pending"
                            ? "#FD7E14"
                            : status === "Completed"
                              ? "#198754"
                              : status === "InProgress"
                                ? "#0D6EFD"
                                : status === "Delayed"
                                  ? "#DC3545"
                                  : "transparent"
                        }
                      />
                      {status}
                    </Box>
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </TableCell>) : (<TableCell>
            <Box display="flex" alignItems="center">
              <StatusCircle
                color={
                  row?.status === "Pending"
                    ? "#FD7E14"
                    : row?.status === "Completed"
                      ? "#198754"
                      : row?.status === "InProgress"
                        ? "#0D6EFD"
                        : row?.status === "Delayed"
                          ? "#DC3545"
                          : "transparent"
                }
              />
              {row?.status || "-"}
            </Box>
          </TableCell>)

        }
         <TableCell>
          {moment(row?.createdAt).isValid()
            ? (<>
              <p> {moment(row?.createdAt).format("DD/MM/YY")}</p>
            <p>{ moment(row?.createdAt).format("hh:mm A")}</p></>)
            : "-"}
        </TableCell>
        <TableCell>
          {moment(row?.updatedAt).isValid()
            ? (<>
              <p> {moment(row?.updatedAt).format("DD/MM/YY")}</p>
            <p>{ moment(row?.updatedAt).format("hh:mm A")}</p></>)
            : "-"}
        </TableCell>
        <TableCell>
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(event) => handleOpenPopover(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{
          width: "auto",
        }}
      >
        {row?.status === "Pending" && user?.role === "owner" && (
          <Link to={`/project/edit/${row?._id}`} state={{ ...row }}>
            <MenuItem>
              <Iconify icon="eva:edit-fill" />
              Edit
            </MenuItem>
          </Link>
        )}
        <Link to={`/project/view/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            View
          </MenuItem>
        </Link>
         <Link to={`/project/kanban/${row?._id}`} state={{ ...row }}>
          <MenuItem>
            <Iconify icon="eva:eye-outline" />
            Kanban Board
          </MenuItem>
        </Link>
        
        {row?.status === "Completed" && row?.serviceScheduled === false && (
          <MenuItem
            onClick={() => {
              setOpenServiceScheduleDialog(true);
              handleClosePopover();
            }}
          >
            <AiTwotoneSchedule />
            Set Service Schedule
          </MenuItem>
        )}

        {row?.status === "Pending" && user?.role === "owner" && (
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        )}
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <LoadingButton
            type="submit"
            variant="contained"
            color="error"
            loading={isLoading}
            onClick={onDeleteRow}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
};

Index.propTypes = {
  isItemSelected: PropTypes.bool.isRequired,
  row: PropTypes.object.isRequired,
  onDeleteRow: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default Index;
