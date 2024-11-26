import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert, Stack } from "@mui/material";
import axios from "axios";


function CreateUser() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "", open: false });

  const createUser = async () => {
    if (!Username || !Password) {
      setFeedback({ message: "All fields are required", type: "error", open: true });
      return;
    }

    try {
      const response = await axios.post("https://fvby3521oi.execute-api.ap-south-1.amazonaws.com/prod/user", {
        Username: Username,
        Password: Password,
      });
      setFeedback({ message: response.data.message, type: "success", open: true });
    } catch (error) {
      setFeedback({ message: "Error creating user", type: "error", open: true });
    }
  };

  return (
    <Stack spacing={3} alignItems="center">
      <h2>Create User</h2>
      <TextField
        label="Username"
        variant="outlined"
        value={Username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Button variant="contained" color="primary" onClick={createUser}>
        Create User
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

export default CreateUser;
