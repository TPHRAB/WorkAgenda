// react
import React, { useState} from 'react';
// material-ui
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card'
import CardBody from 'components/Card/CardBody';
import Tasks from 'components/Tasks/Tasks.js';
import { bugs } from 'variables/general';
import WorkItems from 'components/WorkItems/WorkItems'
// widgets
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// css
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dadhboard() {
  const classes = useStyles();
  const [description, setDescription] = useState("Previous Description");
  const [showEditor, setEditorState] = useState(true);
  const saveDescription = () => {
    setEditorState(false);
  }
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}><b>Project Overview</b></h4>
            </CardHeader>
            <CardBody id="card-header">
              {showEditor ? (
                <div>
                  <CKEditor
                    editor={ ClassicEditor }
                    data={description}
                    onChange={(event, editor) => setDescription(editor.getData())}
                  />
                  <Button id="editor-button" type="button" color="info" onClick={saveDescription}>Save</Button>
                  <Button id="editor-button" type="button" color="default" onClick={() => setEditorState(false)}>Cancel</Button>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="danger">
              <h4 className={classes.cardTitleWhite}><b>Overdue Work</b></h4>
            </CardHeader>
            <CardBody id="card-header">
              <WorkItems />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}><b>Task Status</b></h4>
            </CardHeader>
            <CardBody id="card-header">
               // some sort of graph
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
              <WorkItems />
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
                checkedIndexes={[0,3]}
                tasksIndexes={[0,1,2,3]}
                tasks={bugs}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
