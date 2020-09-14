import React, { useContext, useState } from 'react';
// @material-ui
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// core
import { ProjectContext } from 'layouts/Project';
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem';

export default function ProjectUserDialog(props) {
  // context
  const { pid, showPopupMessage } = useContext(ProjectContext);
  const { showUser, setShowUser, selectedUser } = props;

  // functions
  const handleClose = () => {
    setShowUser(false);
  };

  const removeUser = () => {
    fetch('/api/remove-project-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pid, userToRemove: selectedUser.username })
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot remove user');
        window.location.reload();
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger');
      })
  }

  return (
    <Dialog
      open={showUser}
    >
      <DialogTitle>{selectedUser.username}</DialogTitle>
      <Divider variant="middle"/>
      <DialogContent>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <TextField
              disabled
              inputProps={{ 
                style: {textAlign: 'center'}
              }}
              value={`${selectedUser['first_name']} ${selectedUser['last_name']}`}
              variant="outlined"
              margin="dense"
              fullWidth
            />
          </GridItem>
        </GridContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          cancel
        </Button>
        <Button onClick={removeUser} color="secondary">
          remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}