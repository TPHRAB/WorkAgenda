import React from "react";
// react plugin for creating charts
import Icon from "@material-ui/core/Icon";
import Danger from "components/Typography/Danger.js";
import Warning from "@material-ui/icons/Warning";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

// core components
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import CardIcon from "components/Card/CardIcon";

const useStyles = makeStyles(styles);

export default function Users() {
  const classes = useStyles();
  return (
    <Grid container>
      <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>
                Developer
              </p>
              <h3 className={classes.cardTitle}>
                Chenzhe Zhao
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <PermIdentityIcon />
                  Administrator
              </div>
            </CardFooter>
          </Card>
      </GridItem>
    </Grid>
  );
}