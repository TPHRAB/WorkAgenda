import React from 'react';
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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
// core
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
// widget
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useForm } from 'react-hook-form';
// css
import 'assets/css/popup.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  }
}));

export default function NewProject(props) {
  const classes = useStyles();
  const { popupOpen, setPopupOpen, createBug } = props
  const { register, handleSubmit } = useForm();

  // states
  let description = "";
  const [age, setAge] = React.useState('');

  const handleClose = () => {
    setPopupOpen(false);
  }

  const onSubmit = (data) => {
    createBug({description, ...data});
  }

  return (
      <Dialog open={popupOpen} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick disableEscapeKeyDown>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="form-dialog-title">New Project</DialogTitle>
          <Divider variant="middle" />
          <DialogContent>
            <GridContainer className="hide-horizontal-scroll-bar">
              <GridItem className="increase-bottom-margin" xs={12} sm={12} md={12}>
                <b>Bug Title</b>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
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
              <GridItem xs={12} sm={12} md={12} className="increase-bottom-margin">
                <b>Assign to</b>
                <div className="wrapper">
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={age}
                      label="Age"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </GridItem>
              <GridItem xs={12} sm={12} md={12} className="increase-bottom-margin">
                <b>Add Followers</b>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6} className="increase-bottom-margin">
                <b>Due date</b>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6} className="increase-bottom-margin">
                <b>Severity</b>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
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