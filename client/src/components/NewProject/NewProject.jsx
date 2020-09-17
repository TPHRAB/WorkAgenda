import React, { useContext } from 'react';
// @material-ui
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "components/CustomButtons/Button.js";
import Divider from '@material-ui/core/Divider';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
// core
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { ProtectorContext } from 'utils/Protector';
// utils
import moment from 'moment';
import MomentUtils from "@date-io/moment";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useForm } from 'react-hook-form';
// css
import 'assets/css/popup.css';
import { useState } from 'react';


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

// global varible
let overview = "";

export default function NewProject(props) {
  const { showPopupMessage } = useContext(ProtectorContext);
  const { popupOpen, setPopupOpen } = props
  const { register, handleSubmit } = useForm();

  // states
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  const handleClose = () => {
    setPopupOpen(false);
  }

  const onSubmit = (data) => {
    fetch('/api/create-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        overview,
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD'),
        ...data
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Server error');
      }
      window.location.reload();
    })
    .catch(err => {
      showPopupMessage(err.message, 'danger');
    });
  }

  return (
      <Dialog open={popupOpen} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="form-dialog-title">New Project</DialogTitle>
          <Divider variant="middle" />
          <DialogContent>
            <GridContainer className="hide-horizontal-scroll-bar">
              <GridItem className="increase-bottom-margin" xs={12} sm={12} md={12}>
                <b>Project Name</b>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                />
              </GridItem>
              <GridItem className="increase-bottom-margin" xs={12} sm={12} md={12}>
                <b>Owner</b>
                <TextField
                  margin="dense"
                  name="owner"
                  fullWidth
                  variant="outlined"
                  defaultValue="Me"
                  disabled
                />
              </GridItem>
              <GridItem className="increase-bottom-margin" xs={12} sm={12} md={6}>
                <b>Start Date</b>
                <ThemeProvider theme={materialTheme}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      disablePast
                      autoOk
                      variant="inline"
                      format="MM-DD-YYYY"
                      margin="normal"
                      id="date-picker-inline"
                      value={startDate}
                      onChange={setStartDate}
                      KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      inputVariant="outlined"
                      size="small"
                    />
                  </MuiPickersUtilsProvider>
                </ThemeProvider>
              </GridItem>
              <GridItem className="increase-bottom-margin" xs={12} sm={12} md={6}>
                <b>End Date</b>
                <ThemeProvider theme={materialTheme}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      disablePast
                      autoOk
                      variant="inline"
                      format="MM-DD-YYYY"
                      margin="normal"
                      id="date-picker-inline"
                      value={endDate}
                      onChange={setEndDate}
                      KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      inputVariant="outlined"
                      size="small"
                    />
                  </MuiPickersUtilsProvider>
                </ThemeProvider>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <b className="increase-bottom-margin">Project Overview</b>
                <CKEditor
                  editor={ ClassicEditor }
                  onChange={(event, editor) => overview = editor.getData()}
                  config={{         
                    toolbar: [
                      'heading', '|', 'bold', 'italic', 'blockQuote', '|', 'numberedList',
                      'bulletedList', 'insertTable', '|', 'undo', 'redo'
                    ],
                  }}
                />
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">Add</Button>
            <Button onClick={handleClose} color="default">Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
  )
}