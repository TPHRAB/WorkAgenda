import React, { useState, useEffect } from 'react';
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
// utils
import ReactHtmlParser from 'react-html-parser';
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
import CustomButton from "components/CustomButtons/Button.js";
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
  newComment: {
    padding: '0.9375rem 20px 0px 20px'
  },
  newCommentHeader: {
    height: 0
  },
  userIcon: {
    marginLeft: '-82px'
  },
  tools: {
    textAlign: 'right'
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

// global variable
let refresh = false;

export default function EditBug(props) {
  const { bid, setEditBugOpen, showPopupMessage } = props;
  const classes = useStyles();

  // states
  const [createdDate, setCreatedDate] = useState();
  const [reporter, setReporter] = useState();
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState(-1);
  const [status, setStatus] = useState(-1);
  const [dueDate, setDueDate] = useState();
  const [description, setDescription] = useState();
  const [newComment, setNewComment] = useState();
  const [comments, setComments] = useState([]);

  // functions
  const handleClose = () => {
    if (refresh) 
      window.location.reload();
    else 
      setEditBugOpen(false);
  };

  const postNewComment = () => {
    fetch('/api/comment-bug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bid,
        comment: newComment
      })
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot connect to server');
        showPopupMessage('Post comment successful', 'success');
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger');
      });

    fetch('/api/logged-in-username')
      .then(res => res.username)
      .then(username => {
        let c = {
          creator: username,
          comment: ReactHtmlParser(newComment),
          created_date: moment().format('MM-DD-YYYY')
        }
        setComments([c, ...comments]);
        setNewComment('');
      });
  }

  const saveChanges = () => {
    fetch('/api/edit-bug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bid,
        newValues: {
          title,
          severity,
          status,
          due_date: dueDate.format('YYYY-MM-DD'),
          description
        }
      })
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot save changes');
        showPopupMessage('Save successful', 'success');
        refresh = true;
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger')
      });
  }

  // initialize
  useEffect(() => {
    fetch('/api/get-bug-info?' + new URLSearchParams({ bid }))
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot connect to the server');
        return res;
      })
      .then(res => res.json())
      .then(json => {
        setCreatedDate(moment(json.created_date).format('MM-DD-YYYY'));
        setReporter(json.reporter);
        setTitle(json.title);
        setDescription(json.description);
        setSeverity(json.severity);
        setStatus(json.status);
        setDueDate(moment(json.due_date));

        // reformat comment created dates
        json.comments.forEach(row => {
          row['created_date'] = moment(row['created_date']).format('MM-DD-YYYY');
          row['comment'] = ReactHtmlParser(row['comment']);
        });
        setComments(json.comments)
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger');
      })
  }, []);

  return (
    <Dialog fullScreen open={true} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
          <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
              Edit bug
          </Typography>
          <Button autoFocus color="inherit" onClick={saveChanges}>
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
            <p className={`${classes.content} ${classes.container}`}>Created by {reporter} on {createdDate}</p>
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
                  'heading', '|', 'bold', 'italic', 'blockQuote', '|', 'numberedList',
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
                          value={dueDate}
                          onChange={setDueDate}
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
              <CardHeader color="rose" icon className={classes.newCommentHeader}>
                <CardIcon color="rose" className={classes.userIcon}>
                  <Language />
                </CardIcon>
              </CardHeader>
              <CardBody className={classes.newComment}>
                <CKEditor
                  data={newComment}
                  editor={ ClassicEditor }
                  onChange={(event, editor) => setNewComment(editor.getData())}
                  config={{         
                    toolbar: [
                      'heading', '|', 'bold', 'italic', 'blockQuote', '|', 'numberedList',
                      'bulletedList', 'insertTable', '|', 'undo', 'redo'
                    ],
                  }}
                />
                <div className={classes.tools}>
                  <CustomButton type="button" color="default" onClick={() => setNewComment('')}>Clear</CustomButton>
                  <CustomButton type="button" color="success" onClick={postNewComment}>Post</CustomButton>
                </div>
              </CardBody>
            </Card>
            {
              comments.map((row, index) => {
                return (
                  <Card key={index} className={classes.comment}>
                    <CardHeader color="rose" icon>
                      <CardIcon color="rose" className={classes.userIcon}>
                        <Language />
                      </CardIcon>
                      <p className={classes.subTitle}>
                        <strong>{row.creator}</strong> <span className={classes.grey}>commented on {row.created_date}</span>
                      </p>
                    </CardHeader>
                    <CardBody>{row.comment}</CardBody>
                  </Card>
                )
              })
            }
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}