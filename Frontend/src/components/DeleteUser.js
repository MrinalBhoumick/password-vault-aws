import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert, Stack, Box, Typography } from "@mui/material";
import axios from "axios";

function DeleteUser() {
  const [Username, setUsername] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "", open: false });

  const deleteUser = async () => {
    if (!Username) {
      setFeedback({ message: "Username is required", type: "error", open: true });
      return;
    }

    try {
      const response = await axios.delete(
        "https://fvby3521oi.execute-api.ap-south-1.amazonaws.com/prod/user",
        { data: { Username } }
      );
      setFeedback({ message: response.data.message, type: "success", open: true });
    } catch (error) {
      setFeedback({ message: error.response?.data?.message || "Error deleting user", type: "error", open: true });
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
      <Typography variant="h5" gutterBottom>Delete User</Typography>
      <Stack spacing={2}>
        <TextField
          label="Username"
          variant="outlined"
          value={Username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={deleteUser}
          fullWidth
        >
          Delete User
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

export default DeleteUser;
