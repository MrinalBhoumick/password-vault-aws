import React from "react";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Create User
          </Button>
          <Button color="inherit" component={Link} to="/get-user">
            Get User
          </Button>
          <Button color="inherit" component={Link} to="/update-user">
            Update User
          </Button>
          <Button color="inherit" component={Link} to="/delete-user">
            Delete User
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
