import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar style={{ display: "flex", justifyContent: "space-around" }}>
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
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
