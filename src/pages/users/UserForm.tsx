import React, { useEffect, useState } from "react";
import {
  TextBox,
  Button,
  Dropdown,
  CheckBox,
  RadioGroup,
} from "../../components";
import { IUser } from "../../interface";
import { useForm } from "../../hooks";
import {
  Container,
  Grid,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import UserService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

// defining the initial state for the form
const initialState: IUser = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  groups: []
};

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
    display: "block",
  },
});

export const UserForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };

    if ("firstName" in fieldValues) {
      if (fieldValues.firstName) {
        if (!/^[a-zA-Z]+$/.test(fieldValues.firstName)) {
          temp.firstName =
            "First Name should contain only alphabets not numbers or other special characters.";
        } else {
          temp.firstName = "";
        }
      } else {
        temp.firstName = "This field is required.";
      }
    }

    if ("lastName" in fieldValues) {
      if (fieldValues.lastName) {
        if (!/^[a-zA-Z]+$/.test(fieldValues.lastName)) {
          temp.lastName =
            "Last Name should contain only alphabets not numbers or other special characters.";
        } else {
          temp.lastName = "";
        }
      } else {
        temp.lastName = "This field is required.";
      }
    }

    if ("email" in fieldValues) {
      if (fieldValues.email == "") {
        temp.email = "This field is required.";
      } else if (
        !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(fieldValues.email)
      ) {
        temp.email = "Email is not valid.";
      } else {
        temp.email = "";
      }
    }

    if ("phone" in fieldValues) {
      if (fieldValues.phone) {
        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(fieldValues.phone)) {
          temp.phone = "Mobile number is not valid.";
        } else {
          temp.phone = "";
        }
      } else {
        temp.phone = "This field is required.";
      }
    }

    setErrors({
      ...temp,
    });

    if (fieldValues == values) {
      if (
        temp.firstName == "" &&
        temp.lastName == "" &&
        temp.email == "" &&
        temp.phone == ""
      ) {
        return true;
      }
    }
  };

  // getting the event handlers from our custom hook
  const { onChange, values, errors, setErrors, resetForm, setValues } = useForm(
    initialState,
    true,
    validate,
    initialState
  );

  // submit function
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validate()) {
      if (id != null && id != undefined && parseInt(id) != 0) {
        UserService.update(values, id);
      } else {
        const res = await UserService.create(values);
        console.log(res);
      }
      // navigate("/");
    } else {
      console.log("Form Validation Error");
    }
  }

  //reset form
  const resetFormDetails = () => {
    resetForm();
  };

  const navigateToUserList = () => {
    navigate("/");
  };

  useEffect(() => {
    (async () => {
      if (id != null && id != undefined && parseInt(id) != 0) {
        const user = await UserService.get(id);
        setValues({
          ...user.data,
        });
      }
    })();
  }, []);

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        style={{ minHeight: "100vh" }}
      >
        {id != null && id != undefined && parseInt(id) != 0 ? (
          <h1>Edit User</h1>
        ) : (
          <h1>Add User</h1>
        )}
        <form onSubmit={handleSubmit}>
          <TextBox
            id="firstName"
            name="firstName"
            type="text"
            label="First Name"
            value={values.firstName}
            onChange={onChange}
            error={errors.firstName}
          />

          <TextBox
            id="lastName"
            name="lastName"
            type="text"
            label="Last Name"
            value={values.lastName}
            onChange={onChange}
            error={errors.lastName}
          />

          <TextBox
            id="email"
            name="email"
            type="text"
            label="Email"
            value={values.email}
            onChange={onChange}
            error={errors.email}
            className={classes.field}
            fullWidth
          />
          <TextBox
            id="phone"
            name="phone"
            type="text"
            label="Phone"
            value={values.phone}
            onChange={onChange}
            error={errors.phone}
            className={classes.field}
            fullWidth
          />

          <Button
            type="Submit"
            text="submit"
            color="primary"
            size="small"
            variant="contained"
          />
          <Button
            text="Reset"
            color="default"
            size="small"
            variant="contained"
            onClick={resetForm}
          />
          <Button
            text="Cancel"
            color="default"
            size="small"
            variant="contained"
            onClick={navigateToUserList}
          />
        </form>
      </Grid>
    </>
  );
};
