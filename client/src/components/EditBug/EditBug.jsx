import React, { useState } from 'react';
// @material-ui
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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
// widgets
import moment from 'moment';
import MomentUtils from "@date-io/moment";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// core
import Card from 'components/Card/Card';
import CardHeader from "components/Card/CardHeader.js";
import Language from "@material-ui/icons/Language";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from 'components/Card/CardBody';
// css
import 'assets/css/popup.css';

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
    fontSize: '0.8em',
    color: 'black'
  },
  grey: {
    color: 'grey'
  },
  comment: {
    marginTop: '62px',
    width: '60%',
    marginLeft: '82px',
  },
  userIcon: {
    marginLeft: '-82px'
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditBug(props) {
  const { editBugOpen, setEditBugOpen } = props;
  const classes = useStyles();

  // states
  const [title, setTitle] = useState('This is a bug title');
  const [severity, setSeverity] = useState(0);
  const [status, setStatus] = useState(0);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [description, setDescription] = useState('Some sort of description');

  // functions
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
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
            <CKEditor
              data={description}
              editor={ ClassicEditor }
              onChange={(event, editor) => setDescription(editor.getData())}
              config={{         
                toolbar: [
                  'heading', '|', 'bold', 'italic', 'blockQuote', 'highlight', '|', 'numberedList',
                  'bulletedList', 'insertTable', '|', 'undo', 'redo'
                ],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} className={classes.container}>
            <h4><strong>Bug Information</strong></h4>
            <Table className={classes.table} >
              <TableBody>
                <TableRow>
                  <TableCell style={{width: 100}}>Due on</TableCell>
                  <TableCell style={{width: 250}}>
                    <ThemeProvider theme={materialTheme}>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          autoOk
                          variant="inline"
                          format="MM-DD-YYYY"
                          margin="normal"
                          id="date-picker-inline"
                          value={selectedDate}
                          onChange={setSelectedDate}
                          KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                          inputVariant="outlined"
                          size="small"
                        />
                      </MuiPickersUtilsProvider>
                    </ThemeProvider>
                  </TableCell>
                  <TableCell style={{width: 50, border: 'none'}}></TableCell>
                  <TableCell style={{width: 100}}>Status</TableCell>
                  <TableCell style={{width: 250}}>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth size="small">
                      <Select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                      >
                        <MenuItem value={0}>Open</MenuItem>
                        <MenuItem value={1}>Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell style={{width: 50, border: 'none'}}></TableCell>
                  <TableCell style={{width: 100}}>Severity</TableCell>
                  <TableCell style={{width: 250}}>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth size="small">
                      <Select
                        value={severity}
                        onChange={(event) => setSeverity(event.target.value)}
                      >
                        <MenuItem value={0}>None</MenuItem>
                        <MenuItem value={1}>Minor</MenuItem>
                        <MenuItem value={2}>Major</MenuItem>
                        <MenuItem value={3}>Critical</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
                <TableRow>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12} sm={12} md={12} className={classes.container}>
            <h4><strong>Comments</strong></h4>
             <Card className={classes.comment}>
              <CardHeader color="rose" icon>
                <CardIcon color="rose" className={classes.userIcon}>
                  <Language />
                </CardIcon>
                <p className={classes.subTitle}>
                  <strong>Timmy</strong> <span className={classes.grey}>commented on 12-12-2020</span>
                </p>
              </CardHeader>
              <CardBody>
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