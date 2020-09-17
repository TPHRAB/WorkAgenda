import React, { useContext } from 'react';
// @material-ui
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// core
import { ProtectorContext } from 'utils/Protector';

const useStyles = makeStyles({
  tinyLine: {
    fontSize: '0.7em',
    textAlign: 'right',
    marginTop: '1rem',
    marginBottom: 0
  },
});

const status = {
  'accept': 1,
  'deny': 2,
};

export default function Message(props) {
  const { showPopupMessage } = useContext(ProtectorContext);
  const classes = useStyles();
  const { showMessage, setShowMessage, selectedItem } = props;

  // functions
  const handleClose = () => {
    setShowMessage(false);
  };

  const setStatus = (status) => {
    fetch('/api/update-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mid: selectedItem.mid, status })
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot process invitation');
        setShowMessage(false);
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger');
      })
  }

  return (
    <Dialog
      open={showMessage}
      onClose={handleClose}
    >
      <DialogTitle>Inivitation</DialogTitle>
      <DialogContent>
        {selectedItem.message}
        <DialogContentText className={classes.tinyLine}>
          {selectedItem.created_date}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStatus(status.deny)} color="primary">
          Deny
        </Button>
        <Button onClick={() => setStatus(status.accept)} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
