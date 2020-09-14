import React, { useContext, useEffect, useState } from 'react';
// @material-ui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// core
import { ProjectContext } from 'layouts/Project';
import { Divider } from '@material-ui/core';

export default function FormDialog(props) {
  // context
  const { pid, showPopupMessage } = useContext(ProjectContext);
  const { addUserOpen, setAddUserOpen } = props;

  // states
  const [newUser, setNewUser] = useState();

  // functions
  const handleClose = () => {
    setAddUserOpen(false);
  };

  const handleChange = (event) => {
    setNewUser(event.target.value);
  }

  const addUser = () => {
    fetch('/api/add-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pid, newUser })
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot add user');
        window.location.reload();
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger');
      })
  }

  return (
    <div>
      <Dialog open={addUserOpen} onClose={handleClose}>
        <DialogTitle>Add User</DialogTitle>
        <Divider variant="middle" />
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addUser} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}