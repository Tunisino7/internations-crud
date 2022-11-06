import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { UserForm, UserList } from "./pages/users";
import {
  makeStyles,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@material-ui/core";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#333996",
      light: "#3c44b126",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    background: {
      default: "#f4f5fd",
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: "translateZ(0)",
      },
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
});

const useStyles = makeStyles({
  appMain: {
    paddingLeft: "20px",
    width: "100%",
  },
});

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.appMain}>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<UserList />} />
              <Route path="/add-user" element={<UserForm />} />
              <Route path="/update-user/:id" element={<UserForm />} />
            </Routes>
          </div>
        </Router>
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
