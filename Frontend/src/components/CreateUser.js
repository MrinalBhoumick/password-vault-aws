import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert, Stack, Box, Typography } from "@mui/material";
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
    <Box
      sx={{
        width: 400,
        margin: "0 auto",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>Create User</Typography>
      <Stack spacing={2}>
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
        <Button variant="contained" color="primary" onClick={createUser} fullWidth>
          Create User
        </Button>
      </Stack>

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
    </Box>
  );
}

export default CreateUser;
