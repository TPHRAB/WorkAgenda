// react
import React, { useState} from 'react';
// material-ui
import { makeStyles } from "@material-ui/core/styles";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card'
import CardBody from 'components/Card/CardBody';
// widgets
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// css
import 'assets/css/dashboard.css'

var styles = {
  ...dashboardStyle,
  cardTitle: {
    marginTop: "0",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

export default function Dadhboard() {
  const classes = useStyles();
  const [description, setDescription] = useState("Previous Description");
  const [showEditor, setEditorState] = useState(true);
  const saveDescription = () => {
    console.log(description)
  }
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader>
            <h4 className={classes.cardTitle}><b>Project Description</b></h4>
          </CardHeader>
          <CardBody id="project-description">
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
              description
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
