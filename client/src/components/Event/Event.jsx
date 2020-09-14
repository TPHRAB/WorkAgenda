import React, { useContext, useState } from 'react';
// @material-ui
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
// widget
import MomentUtils from "@date-io/moment";
// core
import { ProjectContext } from 'layouts/Project';
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem';

export default function Event(props) {
  const { showPopupMessage } = useContext(ProjectContext);
  const { showEvent, setShowEvent, selectedEvent } = props;

  // functions
  const deleteEvent = () => {
    fetch('/api/delete-event?' + new URLSearchParams({ eid: selectedEvent.eid }))
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot delete event');
        window.location.reload();
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger');
      });
  }

  const handleClose = () => {
    setShowEvent(false);
  };

  return (
    <Dialog
      open={showEvent}
    >
      <DialogTitle>{selectedEvent.title}</DialogTitle>
      <DialogContent>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDateTimePicker
                disabled
                label="Start date"
                value={selectedEvent.start}
                format="MM-DD-YYYY HH:mm"
              />
            </MuiPickersUtilsProvider>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDateTimePicker
                disabled
                label="End date"
                value={selectedEvent.end}
                format="MM-DD-YYYY HH:mm"
              />
            </MuiPickersUtilsProvider>
          </GridItem>
        </GridContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          cancel
        </Button>
        <Button onClick={deleteEvent} color="secondary" autoFocus>
          delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}