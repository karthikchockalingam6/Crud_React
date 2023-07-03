import React, { useState } from "react";
import { TextField, Button, IconButton, Alert, Snackbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const App = () => {
  const initialValues = {
    nam: { message: "", state: false },
    con: { message: "", state: false },
  };
  const [arrayValues, setArrayValues] = useState([]); //Array
  const [name, setName] = useState({ name: "", context: "" }); //TextField
  const [editing, setEditing] = useState(false); // Toggle Edit
  const [open, setOpen] = useState({ state: false, msg: "" }); //Toggle Snackbar
  const [arrayIndexForEdit, setArrayIndexForEdit] = useState(""); //Updated index after Edit
  const [nameError, setNameError] = useState(initialValues);

  const handleName = (e) => {
    setName({ ...name, [e.target.name]: e.target.value }); //Textfield
  };

  const handleClose = () => setOpen({ state: false, msg: "" }); //Snackbar

  const deleteUser = (i) => {
    if (editing) {
      setOpen({ state: true, msg: "Cannot delete while editing" });
    } else {
      const updatedArray = arrayValues.filter((e) => e !== i);
      setArrayValues(updatedArray);
      setOpen({ state: true, msg: "Deleted" });
    }
  };

  const editPencilClicked = (index) => {
    const tempData = arrayValues[index];
    setName({ name: tempData.name.trim(), context: tempData.context.trim() });
    setNameError(initialValues);
    setEditing(true);
    setArrayIndexForEdit(index);
  };

  const handleDuplicate = (valname, valcontext) => {
    const duplicate = arrayValues.filter(
      (item) => item.name === valname && item.context === valcontext
    );

    if (duplicate.length) {
      return true;
    }
    return false;
  };

  const addUser = () => {
    if (name.name.trim() === "" && name.context.trim() === "") {
      setNameError({
        nam: { message: "Name is required", state: true },
        con: { message: "Context is required", state: true },
      });
    } else if (name.name.trim() === "") {
      setNameError({
        nam: { message: "Name is required", state: true },
        con: { message: "", state: false },
      });
    } else if (name.context.trim() === "") {
      setNameError({
        nam: { message: "", state: false },
        con: { message: "Context is required", state: true },
      });
    } else if (handleDuplicate(name.name, name.context)) {
      setOpen({
        state: true,
        msg: "Name and Context already exists.Try different one.",
      });
      setName({ name: name.name, context: name.context });
    } else if (editing) {
      setArrayValues((prevArray) => {
        const newArray = [...prevArray];
        newArray[arrayIndexForEdit] = name;
        return newArray;
      });
      setEditing(false);
      setName({ name: "", context: "" });
      setNameError(initialValues);
    } else {
      setNameError(initialValues);
      setArrayValues([...arrayValues, name]);
      setName({ name: "", context: "" });
    }
  };

  const column = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "purple",
      cellClassName: "lblue",
    },
    {
      field: "context",
      headerName: "Username",
      headerClassName: "purple",
      cellClassName: "lblue",
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      renderCell: (e) => e.value,
      headerClassName: "purple",
      cellClassName: "lblue",
    },
  ];

  return (
    <div className="m-5 p-5">
      <div className=" grid gap-2 justify-center p-5 mr-5">
        <TextField
          sx={{ backgroundColor: "white" }}
          label="Name"
          onChange={handleName}
          value={name.name}
          name="name"
          error={nameError.nam.state}
          helperText={nameError.nam.message}
        ></TextField>
        <TextField
          sx={{ backgroundColor: "white" }}
          label="Context"
          onChange={handleName}
          value={name.context}
          name="context"
          error={nameError.con.state}
          helperText={nameError.con.message}
        ></TextField>
        <Button variant="contained" onClick={addUser}>
          {editing ? "Update" : "Add"}
        </Button>
      </div>

      <div className=" mx-auto w-full">
        <DataGrid
          rows={arrayValues.map((d, id) => ({
            ...d,
            id,
            actions: (
              <>
                <IconButton onClick={() => editPencilClicked(id)}>
                  <EditIcon color="info" />
                </IconButton>
                <IconButton onClick={() => deleteUser(d)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </>
            ),
          }))}
          columns={column}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            ".purple": {
              backgroundColor: "rgba(213, 184, 255, 0.5)",
            },
            ".lblue": {
              backgroundColor: "rgba(228, 241, 254, 1) ",
            },
          }}
        />
      </div>
      <Snackbar
        open={open.state}
        autoHideDuration={6000}
        onClose={handleClose}
        sx={{ maxWidth: 400 }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {open.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;
