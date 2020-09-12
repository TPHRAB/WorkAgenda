import React from "react";
// react plugin for creating charts
import Icon from "@material-ui/core/Icon";
import Danger from "components/Typography/Danger.js";
import Warning from "@material-ui/icons/Warning";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

// @material-ui/core components
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';

// core components
import Button from 'components/CustomButtons/Button';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CardIcon from "components/Card/CardIcon";
import AddBoxIcon from '@material-ui/icons/AddBox';
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Users() {
  const classes = useStyles();
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span
          style={{
            fontSize: '15px',
          }}
        >
          <Chip label={<b style={{ color: 'green' }}>Active User: 1</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
        </span>
        <Button type="button" color="info">Add User</Button>
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <AccountCircleIcon />
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
      </GridContainer>
    </>
  );
}