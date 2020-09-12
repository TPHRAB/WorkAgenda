import React, { useState, useContext, useEffect } from 'react';
// @material-ui
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "components/CustomButtons/Button.js";
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
// core
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { ProjectContext } from 'layouts/Project';
// widget
import moment from 'moment';
import MomentUtils from "@date-io/moment";
// css
import 'assets/css/popup.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  dateInput: {
    paddingTop: '10.5px',
    marginTop: '0px'
  }
}));

const materialTheme = createMuiTheme({
  overrides: {
    MuiFormControl: {
      marginNormal: {
        marginTop: '0px',
        paddingTop: '10.5px'
      }
    }
  }
});

// global variable
let description = '';

export default function NewEvent(props) {
  // context
  const { pid, showPopupMessage } = useContext(ProjectContext);
  const classes = useStyles();
  const { createEventOpen, setCreateEventOpen } = props;

  // states
  const [title, setTitle] = useState()
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment());

  const handleClose = () => {
    setCreateEventOpen(false);
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }

  const onSubmit = () => {
    fetch('/api/create-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pid,
        title,
        start: start.format('YYYY-MM-DD HH:mm'),
        end: end.format('YYYY-MM-DD HH:mm'),
      })
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Create event failed');
        window.location.reload();
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger');
      });
  }

  return (
      <Dialog open={createEventOpen} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
        <DialogTitle id="form-dialog-title">New Event</DialogTitle>
        <Divider variant="middle" />
        <DialogContent>
          <GridContainer className="hide-horizontal-scroll-bar">
            <GridItem className="increase-bottom-margin" xs={12} sm={12} md={12}>
              <b>Title</b>
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                variant="outlined"
                onChange={handleTitleChange}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6} className="increase-bottom-margin">
              <b>Start</b>
              <ThemeProvider theme={materialTheme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDateTimePicker
                    disablePast
                    autoOk
                    variant="inline"
                    value={start}
                    onChange={setStart}
                    disablePast
                    format="MM-DD-YYYY HH:mm"
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} className="increase-bottom-margin">
              <b>End</b>
              <ThemeProvider theme={materialTheme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDateTimePicker
                    disablePast
                    variant="inline"
                    autoOk
                    value={end}
                    onChange={setEnd}
                    disablePast
                    format="MM-DD-YYYY HH:mm"
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
            </GridItem>
          </GridContainer>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary" onClick={onSubmit}>Add</Button>
          <Button onClick={handleClose} color="default">Cancel</Button>
        </DialogActions>
      </Dialog>
  )
}