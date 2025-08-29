import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Link,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import logo from "../../assets/img/logo.png";
import { useDispatch, useSelector } from "../../redux/store";
import { registerUser  } from "../../redux/slices/auth/authApi";

const schema = yup.object({
  name: yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  phone: yup.string().matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone is required"),
  role: yup.string().required("Role is required"),
}).required();

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
        const response = await dispatch(registerUser(data));
        console.log("register response",response);
      if (response?.payload?.success) {
        navigate("/verify");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed!");
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
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          maxWidth: 600,
          width: "100%",
          backdropFilter: "blur(12px)",
          background: "white",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} alt="Logo" style={{ height: 100 }} />
        </Box>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "black" }}
        >
          Create Account
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
         <Box display="grid" gap={3} gridTemplateColumns="1fr 1fr">
              <TextField
                label="Name"
                placeholder="Name"
                fullWidth
                variant="outlined"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{ style: { background: "#fff" } }}
              />
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
                label="Password"
                placeholder="Password"
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { background: "#fff" },
                }}
              />
           
              <TextField
                label="Phone"
                placeholder="Phone"
                fullWidth
                variant="outlined"
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                InputProps={{ style: { background: "#fff" } }}
              />
              <TextField
                select
                label="Role"
                fullWidth
                              variant="outlined"
                defaultValue=""
                {...register("role")}
                error={!!errors.role}
                helperText={errors.role?.message}
                InputProps={{ style: { background: "#fff" } }}
              >
                {/* <MenuItem value="user">User </MenuItem>
              <MenuItem value="admin">Admin</MenuItem> */}
               <MenuItem value="owner">Owner </MenuItem>
                <MenuItem value="member">Member</MenuItem>
              </TextField>
          </Box>
          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" sx={{ display: "inline", mr: 1 }}>
              Already registered?
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
