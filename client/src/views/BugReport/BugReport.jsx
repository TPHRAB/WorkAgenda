// react
import React from 'react';
import Table from "components/Table/Table.js";

// @material-ui
import { makeStyles } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

// custom-ui
import TableHead from 'components/Table/TableHead';

let styles = {
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

export default function BugReport() {
  const classes = useStyles();
  return (
    <div>
      <Grid container>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  <TableHead name='Status' />,
                  <TableHead name='Issue' />,
                  <TableHead name='Project' />
                ]}
                tableData={[
                    [ "open" , "ABC" , "WorkAgenda"] ,
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </div>
  )
}