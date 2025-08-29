import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import logo from "../../assets/img/logo.png";
import { useDispatch } from "../../redux/store";
import { verifyUser  } from "../../redux/slices/auth/authApi";  

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  otp: yup.string().required("OTP is required"),
}).required();

export default function Verify() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(verifyUser (data));
      if (response?.payload?.success) {
        navigate("/signin");  
      } else {
        toast.error("Verification failed!");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0,0,0,0.6)",
          zIndex: 1,
        }}
      />
      <Paper
        elevation={6}
        sx={{
          position: "relative",
          zIndex: 2,
          p: { xs: 3, sm: 6 },
          borderRadius: 4,
          maxWidth: 460,
          width: "100%",
          backdropFilter: "blur(12px)",
          background: "white",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img src={logo} alt="Logo" style={{ height: 100 }} />
        </Box>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 3, color: "black" }}
        >
          Verify Your Account
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                label="Email"
                placeholder="Email"
            fullWidth
                variant="outlined"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{ style: { background: "#fff" } }}
              />
              <TextField
                label="OTP"
                placeholder="Enter OTP"
            fullWidth
            sx={{ mt: 3, fontWeight: "bold" }}
                variant="outlined"
                {...register("otp")}
                error={!!errors.otp}
                helperText={errors.otp?.message}
                InputProps={{ style: { background: "#fff" } }}
              />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, fontWeight: "bold" }}
          >
            Verify
          </Button>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" sx={{ display: "inline", mr: 1 }}>
              Already verified?
            </Typography>
            <Link component={RouterLink} to="/signin" variant="body2">
              Sign In
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
