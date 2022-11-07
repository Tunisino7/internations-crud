import React, { useEffect, useState } from "react";
import { TextBox, Button } from "../../components";
import { IUser, IGroup } from "../../interface";
import { useForm } from "../../hooks";
import { Grid, makeStyles } from "@material-ui/core";
import UserService from "../../services/userService";
import GroupService from "../../services/groupService";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

// defining the initial state for the form
const initialState: IUser = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
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
  const [groups, setGroups] = useState<any>({ ids: [], labels: [], users: [] });
  const [groupsUpdate, setGroupsUpdate] = useState<any>({
    old: [],
    current: [],
  });

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
      }

      let toAdd = arrDifference(groupsUpdate.current, groupsUpdate.old);
      let toRemove = arrDifference(groupsUpdate.old, groupsUpdate.current);
      const userId: any = id;

      toAdd.forEach((gr) => {
        addToGroup(userId, gr.toString());
      })
      toRemove.forEach((gr) => {
        removeFromGroup(userId, gr.toString());
      })

      navigate("/");
    } else {
      console.log("Form Validation Error");
    }
  }
  
  const addToGroup = async (userId: string, groupId: string) => {
    let group: IGroup = (await GroupService.get(groupId)).data;
    if(!group.users.includes(parseInt(userId)))
      group = {...group, users: [...group.users, parseInt(userId)]};
    
    group = (await GroupService.update(group, groupId)).data;
  };

  const removeFromGroup = async (userId: string, groupId: string) => {
    let group: IGroup = (await GroupService.get(groupId)).data;
    if(group.users.includes(parseInt(userId)))
      group = {...group, users: group.users.filter((el) => el !== parseInt(userId))};
    
    group = (await GroupService.update(group, groupId)).data;
  };

  //reset form
  const resetFormDetails = () => {
    resetForm();
  };

  const navigateToUserList = () => {
    navigate("/");
  };

  const arrDifference = (first: number[], second: number[]) => {
    let b = new Set(second);
    let difference = [...first].filter((x) => !b.has(x));
    return difference;
  };

  useEffect(() => {
    (async () => {
      const groupsData = await GroupService.getAll();
      setGroups({
        ids: groupsData.data.map((a) => a.id),
        labels: groupsData.data.map((a) => a.name),
        users: groupsData.data.map((a) => a.users),
      });

      if (id != null && id != undefined && parseInt(id) != 0) {
        const user = await UserService.get(id);
        setValues({
          ...user.data,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (id != null && id != undefined && parseInt(id) != 0 && groups.users) {
      let currentGroups = groups.users.map((arr: any) =>
        arr.includes(parseInt(id)) ? groups.ids[groups.users.indexOf(arr)] : -1
      );
      currentGroups = currentGroups.filter((a: any) => a > -1);
      setGroupsUpdate({ old: currentGroups, current: currentGroups });
    }
  }, [groups]);

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

          <Autocomplete
            multiple
            id="groups"
            options={groups.ids}
            getOptionLabel={(option: any) =>
              groups.labels[groups.ids.indexOf(option)]
            }
            value={groupsUpdate.current}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="groups"
                placeholder="User Groups"
              />
            )}
            className={classes.field}
            fullWidth
            onChange={(event, newValue) =>
              setGroupsUpdate({ ...groupsUpdate, current: newValue })
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
            onClick={navigateToUserList}
          />
        </form>
      </Grid>
    </>
  );
};
