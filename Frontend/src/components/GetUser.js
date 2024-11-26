import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Snackbar, Alert, Stack } from "@mui/material";
import axios from "axios";

function GetUser() {
  const [Username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "", open: false });

  const getUser = async () => {
    if (!Username) {
      setFeedback({ message: "Username is required", type: "error", open: true });
      return;
    }

    try {
      const response = await axios.get(`https://fvby3521oi.execute-api.ap-south-1.amazonaws.com/prod/user?Username=${Username}`);
      setUserData(response.data);
      setFeedback({ message: "User fetched successfully", type: "success", open: true });
    } catch (error) {
      setUserData(null);
      setFeedback({ message: "Error fetching user", type: "error", open: true });
    }
  };

  return (
    <Stack spacing={3} alignItems="center">
      <h2>Get User</h2>
      <TextField
        label="Username"
        variant="outlined"
        value={Username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
      />
      <Button variant="contained" color="primary" onClick={getUser}>
        Get User
      </Button>

      {userData && (
        <Card style={{ width: "100%", maxWidth: "500px", marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6">User Details</Typography>
            <Typography variant="body1">Username: {userData.Username}</Typography>
            <Typography variant="body1">Password: {userData.Password}</Typography>
          </CardContent>
        </Card>
      )}

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

export default GetUser;
