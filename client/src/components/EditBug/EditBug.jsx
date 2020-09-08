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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from 'components/Card/Card';
import CardHeader from "components/Card/CardHeader.js";
import CardBody from 'components/Card/CardBody';

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
  content: {
    paddingLeft: '14px'
  },
  subTitle: {
    fontSize: 'small',
  }
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
            <p className={`${classes.content} ${classes.container}`}>Created by USERNAME on 12-12-2020</p>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12} md={12} className={classes.container}>
            <h4><strong>Description</strong></h4>
            <TextField
              margin="dense"
              name="title"
              value="This is the bug title"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} className={classes.container}>
            <h4><strong>Bug Information</strong></h4>
            <Table className={classes.table} >
              <TableBody>
                <TableRow>
                  <TableCell style={{width: 100}}>Due on</TableCell>
                  <TableCell style={{width: 250}}>08-18-2020</TableCell>
                  <TableCell style={{width: 50, border: 'none'}}></TableCell>
                  <TableCell style={{width: 100}}>Status</TableCell>
                  <TableCell style={{width: 250}}>Open</TableCell>
                  <TableCell style={{width: 50, border: 'none'}}></TableCell>
                  <TableCell style={{width: 100}}>Severity</TableCell>
                  <TableCell style={{width: 250}}>Critical</TableCell>
                </TableRow>
                <TableRow>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12} sm={12} md={12} className={classes.container}>
            <h4><strong>Comments</strong></h4>
             <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Language />
                </CardIcon>
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Here is the Icon</h4>
                The place is close to Barceloneta Beach and bus stop just 2 min by
                walk and near to "Naviglio" where you can enjoy the main night
                life in Barcelona...
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}