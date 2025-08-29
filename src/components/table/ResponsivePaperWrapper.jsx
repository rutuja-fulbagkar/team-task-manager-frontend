import { Paper } from "@mui/material";

const ResponsivePaperWrapper = ({ children, sx = {} }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        mb: 2,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        ...sx,
       
      }}
    >
      {children}
    </Paper>
  );
};

export default ResponsivePaperWrapper;
