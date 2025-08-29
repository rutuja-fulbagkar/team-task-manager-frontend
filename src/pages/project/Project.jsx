import CloseIcon from "@mui/icons-material/Close";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Button,
  Card,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  Tab,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { saveAs } from "file-saver";
import * as React from "react";
import { Helmet } from "react-helmet-async";
import { CiTimer } from "react-icons/ci";
import { GrInProgress } from "react-icons/gr";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import ExcelToJsonConverterCM from "../../components/extra/ExcelToJsonConverterCM";
import Iconify from "../../components/iconify";
import LoadingContent from "../../components/table/empty-content/loadingContent";
import ResponsivePaperWrapper from "../../components/table/ResponsivePaperWrapper";
import TableNoData from "../../components/table/TableNoData";
import { createSalesOrderbyexcel, findProject,deleteProjectbyId } from "../../redux/slices/project/projectApi";
import { useDispatch, useSelector } from "../../redux/store";
import { api } from "../../utils/api";
import Index from "./TableRow.jsx/Index";

const TABLE_HEAD = [
  { id: "projectCode", label: "Project Code" },
  { id: "projectName", label: "Project Name" },
  { id: "members", label: "Members" },
  { id: "dueDate", label: "Due Date" },
  { id: "status", label: "Status" },
  { id: "createdAt", label: "Created At" },
  { id: "updatedAt", label: "Updated At" },
  { id: "action", label: "Action" },
];

export default function Project() {
   const user = useSelector((state) => state.auth.user);
  const theme = useTheme();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [arrayData, setArrayData] = React.useState([]);
  const [jsonData, setJsonData] = React.useState(null);
  const [timeRange, setTimeRange] = React.useState("");
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [searchText, setSearchText] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [dense, setDense] = React.useState(false);
  const [openImportModale, setOpenImportModale] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const {
    data: users,
    totalRecords,
    isLoading,
  } = useSelector((state) => state.project);
  const isNotFound = !users?.projects?.length;


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    fetchData(newValue);
  };

  const tabLabels = [
    `All Project (${users?.allCount })`,
    `Pending Project (${users?.pendingCount})`,
    `Inprogress Project (${users?.inProgressCount})`,
    `Completed Project (${users?.completedCount})`,
    `Delayed Project (${users?.delayedCount})`,
  ];

  const tabStatuses = ["", "Pending", "InProgress", "Completed", "Delayed"];
  const handleDateChange = (date, type) => {
    if (type === "start") {
      setStartDate(date);
    } else if (type === "end") {
      setEndDate(date);
    }
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const getStartAndEndOfCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const start = new Date(currentYear, 0, 1);
    const end = new Date(currentYear, 11, 31);
    return { start, end };
  };

  const getStartAndEndOfThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  };

  const getStartAndEndOfLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return { start, end };
  };

  const getStartAndEndOfThisWeek = () => {
    const now = new Date();
    const firstDay = now.getDate() - now.getDay();
    const start = new Date(now.setDate(firstDay));
    const end = new Date(now.setDate(firstDay + 6));
    return { start, end };
  };

  const getStartAndEndOfLastWeek = () => {
    const now = new Date();
    const firstDay = now.getDate() - now.getDay() - 7;
    const start = new Date(now.setDate(firstDay));
    const end = new Date(now.setDate(firstDay + 6));
    return { start, end };
  };

  const handleTimeRangeChange = (event) => {
    const selectedTimeRange = event.target.value;
    setTimeRange(selectedTimeRange);

    let start = null;
    let end = null;

    switch (selectedTimeRange) {
      case "currentYear":
        const currentYearDates = getStartAndEndOfCurrentYear();
        start = currentYearDates.start;
        end = currentYearDates.end;
        break;
      case "thisMonth":
        const thisMonthDates = getStartAndEndOfThisMonth();
        start = thisMonthDates.start;
        end = thisMonthDates.end;
        break;
      case "lastMonth":
        const lastMonthDates = getStartAndEndOfLastMonth();
        start = lastMonthDates.start;
        end = lastMonthDates.end;
        break;
      case "thisWeek":
        const thisWeekDates = getStartAndEndOfThisWeek();
        start = thisWeekDates.start;
        end = thisWeekDates.end;
        break;
      case "lastWeek":
        const lastWeekDates = getStartAndEndOfLastWeek();
        start = lastWeekDates.start;
        end = lastWeekDates.end;
        break;
      default:
        break;
    }

    setStartDate(start);
    setEndDate(end);
  };

  const fetchData = React.useCallback(
    async (tabIndex = 0) => {
      const status = tabStatuses[tabIndex] || filterStatus;
      const payload = {
        page: page,
        limit: rowsPerPage,
        status: status,
        search: searchText,
        timeRange: timeRange,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      };
      dispatch(findProject(payload));
    },
    [
      page,
      rowsPerPage,
      dispatch,
      status,
      timeRange,
      searchText,
      startDate,
      filterStatus,
      endDate,
    ]
  );

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const clearFilters = () => {
    setSearchText("");
    setTimeRange("");
    fetchData();
    setStartDate(null);
    setEndDate(null);
  };

  const handleExport = () => {
    const exportData = users?.projects?.map((user) => ({
      "Project Code": user?.projectCode,
      "Project Name": user?.name,
     "Members": user?.members?.map((member) => member?.user?.name).join(", "),
       "Due Date":user?.dueDate,
      "Status": user?.status,
      "Created At": user?.createdAt,
      "Updated At": user?.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, "project.xlsx");
  };

  const handleDeleteRow = async (id) => {
    try {
      const response = await dispatch(deleteProjectbyId(id));
      if (response.payload.success) {
        fetchData();
        toast.success(response.payload.message);
      }
    } catch (error) {
      toast.error(error.response.payload.message);
    }
    setSelected([]);
    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleCloseImportModal = () => {
    setOpenImportModale(false);
  };

  const IMPORT_HEAD_DATA = TABLE_HEAD.filter(
    (item) => item.label !== "Action"
  ).map((item) => item.label);

  const camelCase = (str) =>
    str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");

  const handleSubmit = async () => {
    const payload = [];
    for (let i = 1; i < arrayData[0].length; i += 1) {
      const obj = {};

      arrayData.forEach((row, index) => {
        const key = camelCase(row[0]);
        if (row[i]) {
          obj[key] = row[i];
        }
      });

      if (Object.keys(obj).length > 0) {
        payload.push(obj);
      }
    }

    const response = await dispatch(createSalesOrderbyexcel(payload));
    if (response?.payload?.success) {
      handleCloseImportModal();
      fetchData();
    }
  };


  const orderCards = [
  {
    label: 'Total Orders',
    filterStatus: '',
    tabIndex: 0,
    fetchDataIndex: 0,
    bgColor: '#004f8362',
    textColor: '#fff',
    getCount: (users) =>
      (users?.allCount || 0) +
      (users?.inProgressCount || 0) +
      (users?.completedCount || 0) +
      (users?.delayedCount || 0),
    IconComponent: ConfirmationNumberIcon,
  },
  {
    label: 'Pending',
    filterStatus: 'Pending',
    tabIndex: 1,
    fetchDataIndex: 1,
    bg: 'transparent',  
    textColor: '#000',
    getCount: (users) => users?.allCount || 0,
    IconComponent: CiTimer,
  },
  {
    label: 'In Progress',
    filterStatus: 'InProgress',
    tabIndex: 2,
    fetchDataIndex: 2,
    bgColor: '#004f8362',
    textColor: '#fff',
    getCount: (users) => users?.inProgressCount || 0,
    IconComponent: GrInProgress,
  },
  {
    label: 'Completed',
    filterStatus: 'Completed',
    tabIndex: 3,
    fetchDataIndex: 3,
    bg: 'transparent',  
    textColor: '#000',
    getCount: (users) => users?.completedCount || 0,
    IconComponent: IoCheckmarkDoneCircle,
  },
  {
    label: 'Delayed',
    filterStatus: 'Delayed',
    tabIndex: 4,
    fetchDataIndex: 4,
    bgColor: '#004f8362',
    textColor: '#fff',
    getCount: (users) => users?.delayedCount || 0,
    IconComponent: MdOutlinePendingActions,
  },
];
  return (
    <>
      <Helmet>
        <title>Project Management</title>
      </Helmet>

      <Box className="w-full sm:px-6 lg:px-8 max-w-9xl mx-auto">
        <ResponsivePaperWrapper>
          <Box className="w-full  py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Typography
              variant="h5"
              fontWeight="bold"
              className="libre-baskerville-regular !text-[35px] "
            >
              Project
            </Typography>
            <div className="flex items-center gap-2">
              {/* <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={() => setOpenImportModale(true)}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#4b5563] !border-[#4b5563]"
              >
                Import
              </Button> */}
              <Button
                variant="outlined"
                onClick={handleExport}
                startIcon={<Iconify icon="ic:baseline-download" />}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#4b5563] !border-[#4b5563]"
              >
                Export
              </Button>
              {user?.role === "owner" && (
              <Button
                component={RouterLink}
                to="/project/new"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#fff] !border-[#4b5563]"
              >
                New Project
              </Button>
                )}
               <Button
                component={RouterLink}
                to="/project/new-task"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                className="text-nowrap Inter-regular !px-4 !py-2 !text-[#fff] !border-[#4b5563]"
              >
                New Task
              </Button>
             
            </div>
          </Box>
        </ResponsivePaperWrapper>
        <Box className="py-[12px] flex items-center flex-col lg:flex-row gap-[24px] mb-[12px]">
    {orderCards.map(
      (
        {
          label,
          filterStatus,
          tabIndex,
          fetchDataIndex,
          bgColor,
          textColor,
          getCount,
          IconComponent,
        },
        index
      ) => (
        <Box key={index} className="rounded-none w-full">
          <Card
            className={bgColor ? '!bg-[#004f8362]' : undefined}
            style={{
              background: !bgColor ? theme.palette.background.default : undefined,
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 3,
              cursor: 'pointer',
            }}
            onClick={() => {
              setFilterStatus(filterStatus);
              setTabValue(tabIndex);
              setPage(0);
              fetchData(fetchDataIndex);
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                className={`!mb-[15px] !text-[18px] !tracking-[0.5px] ${
                  textColor === '#fff' ? '!text-[#fff]' : '!text-[#000]'
                } Roboto-regular`}
              >
                {label}
              </Typography>
              <Typography
                className={`font-mono !font-[500] ${
                  textColor === '#fff' ? '!text-[#fff]' : ''
                }`}
              >
                {getCount(users)}
              </Typography>
            </Box>
            <Typography variant="subtitle2">
              <IconComponent className={`!text-[26px] ${textColor === '#fff' ? '!text-[#fff]' : ''}`} />
            </Typography>
          </Card>
        </Box>
      )
    )}
  </Box>

        <Box>
          <Paper sx={{ mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  gap: 2,
                  py: 2,
                  px: { xs: 2, sm: 3 },
                  borderRadius: "8px",
                  boxShadow: 1,
                }}
              >
                <DatePicker
                  label="Start Date"
                  format="dd/MM/yyyy"
                  className="!min-w-[145px]"
                  value={startDate}
                  onChange={(newValue) => handleDateChange(newValue, "start")}
                  disabled={timeRange}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { width: { xs: "45%", sm: "10%" } },
                    },
                  }}
                />
                <DatePicker
                  label="End Date"
                  format="dd/MM/yyyy"
                  className="!min-w-[145px]"
                  value={endDate}
                  onChange={(newValue) => handleDateChange(newValue, "end")}
                  disabled={timeRange}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { width: { xs: "45%", sm: "10%" } },
                    },
                  }}
                />

                <FormControl
                  size="small"
                  sx={{ width: { xs: "45%", sm: "10%" }, minWidth: "145px" }}
                >
                  <InputLabel id="status-label">Date Range</InputLabel>
                  <Select
                    labelId="status-label"
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                    label="Time Range"
                  >
                    <MenuItem value="currentYear">Current Year</MenuItem>
                    <MenuItem value="lastMonth">Last Month</MenuItem>
                    <MenuItem value="thisMonth">This Month</MenuItem>
                    <MenuItem value="lastWeek">Last Week</MenuItem>
                    <MenuItem value="thisWeek">This Week</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ flex: 1 }}>
                  <OutlinedInput
                    fullWidth
                    className="Search_Input !min-w-[345px]"
                    placeholder="Search by project no.,name, assigned to...."
                    value={searchText}
                    onChange={handleSearchChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </Box>
                {(searchText || timeRange || startDate || endDate) && (
                  <IconButton sx={{ width: "5%" }} onClick={clearFilters}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </LocalizationProvider>

            <Box sx={{ py: 1, width: "100%" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Project Status Tabs"
                variant={isSmallScreen ? "scrollable" : "standard"}
                scrollButtons={isSmallScreen ? "auto" : false}
                allowScrollButtonsMobile
                TabIndicatorProps={{
                  style: {
                    height: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                sx={{
                  "& .MuiTab-root": {
                    minWidth: isSmallScreen ? 100 : 120,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: 14,
                  },
                }}
              >
                {tabLabels.map((label, index) => (
                  <Tab key={index} label={label} />
                ))}
              </Tabs>
            </Box>

            <TableContainer className="overflow-x-auto">
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>&nbsp;</TableCell>
                   {TABLE_HEAD.map((headCell) => (
      <TableCell
        key={headCell.id}
        align={headCell.numeric ? "right" : "left"}
        padding={headCell.disablePadding ? "none" : "normal"}
      >
        {headCell.label}
      </TableCell>
    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLoading ? (
                    (users?.projects || [])?.map((row, index) => {
                      const isItemSelected = selected.includes(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <Index
                          isItemSelected={isItemSelected}
                          isLoading={isLoading}
                          onDeleteRow={() => handleDeleteRow(row?._id)}
                          row={row}
                          key={row._id}
                        />
                      );
                    })
                  ) : (
                    <LoadingContent />
                  )}
                  {!isLoading && <TableNoData isNotFound={isNotFound} />}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
                sx={{ ml: "20px" }}
              />
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={totalRecords || 5}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openImportModale}
        onClose={handleCloseImportModal}
      >
        <DialogTitle>
          Import Project
          <IconButton
            aria-label="close"
            onClick={handleCloseImportModal}
            style={{ position: "absolute", right: "10px", top: "15px" }}
          >
            <CloseIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </DialogTitle>

        <ExcelToJsonConverterCM
          headingData={IMPORT_HEAD_DATA}
          handleSubmit={handleSubmit}
          arrayData={arrayData}
          setArrayData={setArrayData}
          jsonData={jsonData}
          setJsonData={setJsonData}
        />
      </Dialog>
    </>
  );
}
