import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert, Stack, Box, Typography, Card, CardContent } from "@mui/material";
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
      <Typography variant="h5" gutterBottom>Get User</Typography>
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
          color="primary"
          onClick={getUser}
          fullWidth
        >
          Get User
        </Button>
      </Stack>

      {userData && (
        <Card sx={{ width: "100%", maxWidth: 500, marginTop: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>User Details</Typography>
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
    </Box>
  );
}

export default GetUser;
