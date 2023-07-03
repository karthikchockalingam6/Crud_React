import React, { useState } from "react";
import { TextField, Button, IconButton, Alert, Snackbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const App = () => {
  const [arrayValues, setArrayValues] = useState([]);
  const [name, setName] = useState({ name: "", context: "" });
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState({ state: false, msg: "" });
  const [arrayIndexForEdit, setArrayIndexForEdit] = useState("");
  const [nameError, setNameError] = useState({
    nam: { message: "", state: false },
    con: { message: "", state: false },
  });

  const handleName = (e) => {
    setName({ ...name, [e.target.name]: e.target.value });
  };

  const handleClose = () => setOpen(false);

  const deleteUser = (i) => {
    if (editing) {
      setOpen({ state: true, msg: "Cannot delete while editing" });
    } else {
      setArrayValues((prevArray) => prevArray.filter((e) => e !== i));
      setOpen({ state: true, msg: "Deleted" });
    }
  };

  const editPencilClicked = (index) => {
    const tempData = arrayValues[index];
    setName({ name: tempData.name.trim(), context: tempData.context.trim() });
    setNameError({
      nam: { message: "", state: false },
      con: { message: "", state: false },
    });
    setEditing(true);
    setArrayIndexForEdit(index);
  };

  const handleDuplicate = (valname, valcontext) => {
    return arrayValues.some(
      (item) => item.name === valname && item.context === valcontext
    );
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
        msg: "Name and Context already exist. Try different one.",
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
      setNameError({
        nam: { message: "", state: false },
        con: { message: "", state: false },
      });
    } else {
      setArrayValues((prevArray) => [...prevArray, name]);
      setName({ name: "", context: "" });
    }
  };

  const columns = [
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
      renderCell: (params) => (
        <>
          <IconButton onClick={() => editPencilClicked(params.row.id)}>
            <EditIcon color="info" />
          </IconButton>
          <IconButton onClick={() => deleteUser(params.row)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
      headerClassName: "purple",
      cellClassName: "lblue",
    },
  ];

  return (
    <div className="m-5 p-5">
      <div className="grid gap-2 justify-center p-5 mr-5">
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

      <div className="mx-auto w-full">
        <DataGrid
          rows={arrayValues.map((d, id) => ({ ...d, id }))}
          columns={columns}
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
