import React from 'react';
// @material-ui
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "components/CustomButtons/Button.js";
import Divider from '@material-ui/core/Divider';
// core
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
// widget
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useForm } from 'react-hook-form';
// css
import 'assets/css/popup.css';

export default function NewProject(props) {
  const { popupOpen, setPopupOpen, createProject } = props
  const { register, handleSubmit } = useForm();
  let overview = "";

  const handleClose = () => {
    setPopupOpen(false);
  }

  const onSubmit = (data) => {
    createProject({overview, ...data});
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
                <TextField
                  margin="dense"
                  name="start_date"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                />
              </GridItem>
              <GridItem className="increase-bottom-margin" xs={12} sm={12} md={6}>
                <b>End Date</b>
                <TextField
                  margin="dense"
                  name="end_date"
                  fullWidth
                  variant="outlined"
                  inputRef={register}
                />
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