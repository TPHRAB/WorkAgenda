// react
import React, { useState, useContext } from 'react';
// material-ui
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card'
import CardBody from 'components/Card/CardBody';
import Tasks from 'components/Tasks/Tasks.js';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import WorkItems from 'components/WorkItems/WorkItems'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BugReportIcon from '@material-ui/icons/BugReport';
import EditIcon from '@material-ui/icons/Edit';
// widgets
import ReactHtmlParser from 'react-html-parser';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Pie } from 'react-chartjs-2';
// core
import { ProjectContext } from 'layouts/Project';
// css
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);


function createOverdueWork(userIcon, title, type, message) {
  if (!userIcon) {
    userIcon = <AccountCircleIcon />;
  }
  type = <BugReportIcon />;
  message = `late by ${message} days`;
  return { userIcon, title, type, message };
}

function createUpcomingWork(userIcon, title, type, message) {
  if (!userIcon) {
    userIcon = <AccountCircleIcon />;
  }
  type = <BugReportIcon />;
  message = `due in ${message} days`;
  return { userIcon, title, type, message };
}

export default function Dadhboard(props) {
  const { pid, showPopupMessage, setProjectInfo } = useContext(ProjectContext);

  const classes = useStyles();
  const [description, setDescription] = useState('');
  const [showEditor, setEditorState] = useState(false);
  const [overdueWork, setOverdueWork] = useState([]);
  const [bugStatus, setBugStatus] = useState([]);
  const [upcomingWork, setUpcomingWork] = useState([]);
  const [notes, setNotes] = useState([]);

  let tempOverview;

  const syncNotes = (notes) => {
    let params = new FormData();
    params.append('pid', pid);
    params.append('notes', JSON.stringify(notes));
    fetch('/api/update-notes', { method: 'POST', body: params })
      .then(res => {
        if (!res.ok) showPopupMessage('Server error', 'danger');
      })
    setNotes(notes);
  }

  const syncOverview = () => {
    setEditorState(false);
    setDescription(tempOverview);
    fetch('/api/update-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pid,
        newValues: {
          overview: tempOverview
        }
      })
    });
  }

  React.useEffect(() => {
    fetch('/api/dashboard?' + new URLSearchParams({ pid }))
      .then(res => res.json())
      .then(json => {
        // fill overview
        setDescription(json.overview);

        let temp = [];
        // set overdue works
        json.overdueWork.forEach(item => {
          temp.push(createOverdueWork(null, item.title, null, item.lateDays));
        });
        setOverdueWork(temp);

        temp = [];
        // set overdue works
        json.upcomingWork.forEach(item => {
          temp.push(createUpcomingWork(null, item.title, null, item.daysLeft));
        });
        setUpcomingWork(temp);

        // set notes
        setNotes(json.notes);

        // set bug status
        setBugStatus(json.bugStatus);
      });
  }, []);
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                <b>Project Overview</b>
                <Tooltip
                  title='Edit'
                  placement="top"
                  onClick={() => {setEditorState(true)}}
                >
                  <IconButton aria-label="Close">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </h4>
            </CardHeader>
            <CardBody id="card-header">
              {showEditor ? (
                <div>
                  <CKEditor
                    editor={ ClassicEditor }
                    data={description}
                    onChange={(event, editor) => tempOverview = editor.getData()}
                    config={{         
                      toolbar: [
                        'heading', '|', 'bold', 'italic', 'blockQuote', 'link', '|', 'numberedList',
                        'bulletedList', 'insertTable', '|', 'undo', 'redo'
                      ],
                    }}
                  />
                  <Button id="editor-button" type="button" color="info" onClick={syncOverview}>Save</Button>
                  <Button id="editor-button" type="button" color="default" onClick={() => setEditorState(false)}>Cancel</Button>
                </div>
              ) : (
                <div>{ReactHtmlParser(description)}</div>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card className={classes.card}>
            <CardHeader color="danger">
              <h4 className={classes.cardTitleWhite}><b>Overdue Work</b></h4>
            </CardHeader>
            <CardBody id="card-header">
              <WorkItems rows={overdueWork} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card className={classes.card}>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}><b>Task Status</b></h4>
            </CardHeader>
            <CardBody id="card-header">
               <Pie
                data={{
                  labels: [
                    'Open',
                    'Closed',
                  ],
                  datasets: [{
                    data: bugStatus,
                    backgroundColor: [
                      '#36A2EB',
                      '#a3a3c2'
                    ],
                    hoverBackgroundColor: [
                      '#66b3ff',
                      '#b3b3cc'
                    ]
                  }]
                }}
                height={300}
                options={{
                  maintainAspectRatio: false,
                  legend: {
                    position: 'right'
                  }
                }}
               />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardHeader color="rose">
              <h4 className={classes.cardTitleWhite}><b>Schedule</b></h4>
            </CardHeader>
            <CardBody id="card-header">
               // calender for this month
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}><b>Upcoming Work Items</b></h4>
            </CardHeader>
            <CardBody id="card-header">
              <WorkItems rows={upcomingWork} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}><b>Notes</b></h4>
            </CardHeader>
            <CardBody id="card-header">
              <Tasks
                tasks={notes}
                syncNotes={syncNotes}
                setNotes={setNotes}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
