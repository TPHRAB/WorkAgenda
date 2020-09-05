import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import DialogContent from '@material-ui/core/DialogContent';

import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  bugTitle: {
    width: '50%'
  },
  resize: {
    fontSize: 'x-large'
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditBug(props) {
  const { editBugOpen, setEditBugOpen } = props;
  const classes = useStyles();

  const handleClose = () => {
    setEditBugOpen(false);
  };

  return (
    <Dialog fullScreen open={editBugOpen} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
          <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
              Edit bug
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
              Save Changes
          </Button>
          </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              margin="dense"
              name="title"
              value="This is the bug title"
              className={classes.bugTitle}
              variant="outlined"
              InputProps={{
                classes: {
                  input: classes.resize
                }
              }}
            />
            <p style={{fontSize: 'small', paddingLeft: '14px'}}>Created by USERNAME on 12-12-2020</p>
          </Grid>
          <Divider />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}