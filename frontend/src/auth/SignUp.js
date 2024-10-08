import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  Link,
  Alert, // Import Alert component from MUI for displaying error messages
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import ApiUrl from "../ServerApi";

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const auth = getAuth();
  const [error, setError] = useState(""); // State to store error message

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error message on submit

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName}`,
      });

      // Save user to MongoDB
      await axios.post(`${ApiUrl}/api/users`, {
        email,
        firstName,
        lastName,
        institute: "Default Ins",
        org: "Default Org",
        dept: "Default Dept",
        lab: "Default Lab",
        role: "Tester", // Default role
      });

      console.log("User signed up:", user);
      login(user);
      console.log("Navigating to /dashboard");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email.");
      } else {
        setError("Failed to sign up. Please try again.");
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {/* Display error message if there's an error */}
          {error && <Alert severity="error">{error}</Alert>}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
