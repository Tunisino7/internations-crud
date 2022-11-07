import React, { useEffect, useState } from "react";
import {
  TextBox,
  Button,
} from "../../components";
import { IGroup } from "../../interface";
import { useForm } from "../../hooks";
import {
  Grid,
  makeStyles,
} from "@material-ui/core";
import UserService from "../../services/userService";
import GroupService from "../../services/groupService";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

// defining the initial state for the form
const initialState: IGroup = {
  id: "",
  name: "",
  users: [],
};

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
    display: "block",
  },
});

export const GroupForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const [users, setUsers] = useState<any>({ ids: [], labels: [] });

  const validate = (fieldValues = values) => {
    let temp: any = { ...errors };

    if ("name" in fieldValues) {
      if (!fieldValues.name) {
        temp.name = "This field is required.";
      }
    }

    setErrors({
      ...temp,
    });

    if (fieldValues == values) {
      if (temp.name == "") {
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
        GroupService.update(values, id);
      } else {
        const res = await GroupService.create(values);
      }
      navigate("/");
    } else {
      console.log("Form Validation Error");
    }
  }

  //reset form
  const resetFormDetails = () => {
    resetForm();
  };

  const navigateToGroupList = () => {
    navigate("/");
  };

  useEffect(() => {
    (async () => {
      const usersData = await UserService.getAll();
      setUsers({
        ids: usersData.data.map((a) => a.id),
        labels: usersData.data.map((a) => a.firstName + " " + a.lastName),
      });

      if (id != null && id != undefined && parseInt(id) != 0) {
        const group = await GroupService.get(id);
        setValues({
          ...group.data,
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
          <h1>Edit Group</h1>
        ) : (
          <h1>Add Group</h1>
        )}
        <form onSubmit={handleSubmit}>
          <TextBox
            id="name"
            name="name"
            type="text"
            label="Name"
            value={values.name}
            onChange={onChange}
            error={errors.name}
            className={classes.field}
            fullWidth
          />

          <Autocomplete
            multiple
            id="users"
            options={users.ids}
            getOptionLabel={(option: any) =>
              users.labels[users.ids.indexOf(option)]
            }
            value={values.users}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="users"
                placeholder="Group Users"
              />
            )}
            className={classes.field}
            fullWidth
            onChange={(event, newValue) =>
              setValues({ ...values, users: newValue })
            }
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
            onClick={navigateToGroupList}
          />
        </form>
      </Grid>
    </>
  );
};
