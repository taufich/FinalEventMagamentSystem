import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const url = "https://jsonplaceholder.typicode.com/users";

  useEffect(() => {
    async function getAllUsers() {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    getAllUsers();
  }, [url]);

  const handleDelete = (id) => {
    // Logic for deleting a user (mocked for now)
    setSnackbarMessage(`User with ID ${id} deleted`);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <TableContainer component={Paper}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%' }}>Actions</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>Id</TableCell>
              <TableCell align="right" sx={{ width: '30%' }}>Name</TableCell>
              <TableCell align="right" sx={{ width: '30%' }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>
                    <Button variant="contained" color="primary" size="small" startIcon={<EditIcon />}>Edit</Button>
                    <Button variant="contained" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => handleDelete(user.id)}>Delete</Button>
                  </TableCell>
                  <TableCell align="right">{user.id}</TableCell>
                  <TableCell align="right">{user.name}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
}

export default UserTable;
