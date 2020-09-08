import React, { useState, useCallback } from 'react';
// @material-ui
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "components/CustomButtons/Button.js";
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
// core
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
// widget
import moment from 'moment';
import MomentUtils from "@date-io/moment";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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

export default function NewBug(props) {
  const classes = useStyles();
  const { createBugOpen, setCreateBugOpen, createBug } = props

  // states
  let description = '';
  const [selectedDate, setSelectedDate] = React.useState(moment());
  const [severity, setSeverity] = React.useState(0);
  const [title, setTitle] = React.useState()

  const handleClose = () => {
    setCreateBugOpen(false);
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }

  const onSubmit = () => {
    createBug({
      description,
      due_date: selectedDate.format('YYYY-MM-DD'),
      severity,
      title
    })
  }

  return (
      <Dialog open={createBugOpen} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
        <DialogTitle id="form-dialog-title">New Project</DialogTitle>
        <Divider variant="middle" />
        <DialogContent>
          <GridContainer className="hide-horizontal-scroll-bar">
            <GridItem className="increase-bottom-margin" xs={12} sm={12} md={12}>
              <b>Bug Title</b>
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                variant="outlined"
                onChange={handleTitleChange}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={12} className="increase-bottom-margin">
              <b>Description</b>
              <div className="wrapper">
                <CKEditor
                  editor={ ClassicEditor }
                  onChange={(event, editor) => description = editor.getData()}
                />
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} className="increase-bottom-margin">
              <b>Due date</b>
              <ThemeProvider theme={materialTheme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    autoOk
                    variant="inline"
                    format="YYYY/MM/DD"
                    margin="normal"
                    id="date-picker-inline"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    inputVariant="outlined"
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} className="increase-bottom-margin">
              <b>Severity</b>
              <div className="wrapper">
                <FormControl variant="outlined" className={classes.formControl} fullWidth>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={severity}
                    onChange={(event) => setSeverity(event.target.value)}
                  >
                    <MenuItem value={0}>None</MenuItem>
                    <MenuItem value={1}>Minor</MenuItem>
                    <MenuItem value={2}>Major</MenuItem>
                    <MenuItem value={3}>Critical</MenuItem>
                  </Select>
                </FormControl>
              </div>
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