import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert, Stack, Box, Typography } from "@mui/material";
import axios from "axios";

function UpdateUser() {
  const [Username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "", open: false });

  const updateUser = async () => {
    if (!Username || !newPassword) {
      setFeedback({ message: "All fields are required", type: "error", open: true });
      return;
    }

    try {
      const response = await axios.put("https://fvby3521oi.execute-api.ap-south-1.amazonaws.com/prod/user", {
        Username: Username,
        Password: newPassword,
      });
      setFeedback({ message: response.data.message, type: "success", open: true });
    } catch (error) {
      setFeedback({ message: "Error updating user", type: "error", open: true });
    }
  };

  return (
    <Stack spacing={3} alignItems="center" sx={{ minHeight: "100vh", justifyContent: "center" }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          padding: "30px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Update User
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          value={Username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={updateUser}>
          Update Password
        </Button>
      </Box>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.type}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default UpdateUser;
