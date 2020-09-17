import React, { useState, useContext } from 'react';
// @material-ui
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
// utils
import moment from 'moment';
import MomentUtils from "@date-io/moment";
// core
import Button from 'components/CustomButtons/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { ProjectContext } from 'layouts/Project';
import 'assets/css/project-settings.css';

const useStyles = makeStyles({
  center: {
    textAlign: 'center'
  },
  shortInput: {
    width: '15em'
  },
  button: {
    width: '8em',
    margin: '2em 1em 0em 1em'
  }
});

export default function ProjectSettings() {
  // context
  const { pid, showPopupMessage, username } = useContext(ProjectContext);
  const classes = useStyles();

  // state
  const [initial, setInitial] = useState();
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('')
  const [status, setStatus] = useState(0);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [disabled, setDisabled] = useState(true);

  // functions
  const saveChanges = () => {
    let newValues = {
      name,
      owner,
      status,
      start_date: start.format('YYYY-MM-DD'),
      end_date: end.format('YYYY-MM-DD')
    };

    fetch('/api/update-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pid,
        newValues
      })
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot save changes');
        showPopupMessage('Save successful', 'success')
        setInitial(newValues);
      })
      .catch(error => 
        showPopupMessage(error.message, 'danger')
      );
  }

  const setFields = (projectInfo) => {
    setName(projectInfo['name']);
    setOwner(projectInfo['owner']);
    setStatus(projectInfo['status']);
    setStart(projectInfo['start_date']);
    setEnd(projectInfo['end_date']);
  }

  const restore = () => {
    setFields(initial);
  }

  // initialize
  useState(() => {
    fetch('/api/get-project-settings?' + new URLSearchParams({ pid }))
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot connect to server')
        return res;
      })
      .then(res => res.json())
      .then(json => {
        json['start_date'] = moment(json['start_date']);
        json['end_date'] = moment(json['end_date']);
        setFields(json);
        setInitial(json);
        if (json['owner'] === username)
          setDisabled(false);
      })
      .catch(error => 
        showPopupMessage(error.message, 'danger')
      );
  }, []);

  return (
    <Card>
      <CardBody>
        <GridContainer>
          <GridItem
            xs={12} sm={12} md={12}
            direction="row"
            alignItems="center"
            justify="space-around"
            container
          >
            <span className="title-field">
              <h4>Project name</h4>
            </span>
            <span className="input-field">
              <TextField
                disabled={disabled}
                margin="dense"
                variant="outlined"
                value={name}
                fullWidth
                inputProps={{
                  className: classes.center
                }}
                onChange={(event) => setName(event.target.value)}
              />
            </span>
          </GridItem>
          <GridItem
            xs={12} sm={12} md={12}
            direction="row"
            alignItems="center"
            justify="space-around"
            container
          >
            <span className="title-field">
              <h4>Owner</h4>
            </span>
            <span className="input-field">
              <TextField
                disabled={disabled}
                value={owner}
                className={classes.shortInput}
                margin="dense"
                variant="outlined"
                inputProps={{
                  className: classes.center
                }}
                onChange={(event) => setOwner(event.target.value)}
              />
            </span>
          </GridItem>

          <GridItem
            xs={12} sm={12} md={12}
            direction="row"
            alignItems="center"
            justify="space-around"
            container
          >
            <span className="title-field">
              <h4>Status</h4>
            </span>
            <span className="input-field">
              <FormControl variant="outlined" size="small" className={classes.shortInput}>
                <Select
                  disabled={disabled}
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  inputProps={{
                    className: classes.center
                  }}
                >
                  <MenuItem value={0}>Active</MenuItem>
                  <MenuItem value={1}>Completed</MenuItem>
                </Select>
              </FormControl>
            </span>
          </GridItem>

          <GridItem
            xs={12} sm={12} md={12}
            direction="row"
            alignItems="center"
            justify="space-around"
            container
          >
            <span className="title-field">
              <h4>Start</h4>
            </span>
            <span className="input-field">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  disabled={disabled}
                  className={classes.shortInput}
                  disableToolbar
                  autoOk
                  variant="inline"
                  format="MM-DD-YYYY"
                  margin="normal"
                  value={start}
                  onChange={setStart}
                  inputVariant="outlined"
                  size="small"
                  inputProps={{
                    className: classes.center
                  }}
                />
              </MuiPickersUtilsProvider>
            </span>
          </GridItem>

          <GridItem
            xs={12} sm={12} md={12}
            direction="row"
            alignItems="center"
            justify="space-around"
            container
          >
            <span className="title-field">
              <h4>End</h4>
            </span>
            <span className="input-field">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  disabled={disabled}
                  className={classes.shortInput}
                  disableToolbar
                  minDate={start}
                  autoOk
                  variant="inline"
                  format="MM-DD-YYYY"
                  margin="normal"
                  value={end}
                  onChange={setEnd}
                  inputVariant="outlined"
                  size="small"
                  inputProps={{
                    className: classes.center
                  }}
                />
              </MuiPickersUtilsProvider>
            </span>
          </GridItem>

          <GridItem container justify='center' className='full-width'>
            <Button
              disabled={disabled}
              color='success'
              className={classes.button}
              onClick={saveChanges}>Save</Button>
            <Button
              disabled={disabled}
              color='warning'
              className={classes.button}
              onClick={restore}>Restore</Button>
          </GridItem>

        </GridContainer>
      </CardBody>
    </Card>
  );
}