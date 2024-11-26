import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert, Stack } from "@mui/material";
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
    <Stack spacing={3} alignItems="center">
      <h2>Update User</h2>
      <TextField
        label="Username"
        variant="outlined"
        value={Username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="New Password"
        type="password"
        variant="outlined"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        required
      />
      <Button variant="contained" color="primary" onClick={updateUser}>
        Update Password
      </Button>

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
