import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';
// utils
import moment from 'moment';
// core
import ProjectUserDialog from 'components/ProjectUserDialog/ProjectUserDialog';
import AddUser from 'components/AddUser/AddUser';
import Button from 'components/CustomButtons/Button';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CardIcon from "components/Card/CardIcon";
import { ProjectContext } from 'layouts/Project';
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import 'assets/css/popup.css';

const useStyles = makeStyles(styles);

export default function Users() {
  // context
  const classes = useStyles();
  const { pid, showPopupMessage, username } = useContext(ProjectContext);

  // states
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUser, setShowUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  // functions
  const selectUser = (userInfo) => {
    setShowUser(true);
    setSelectedUser(userInfo);
  }

  // initialize
  useEffect(() => {
    fetch('/api/get-project-users?' + new URLSearchParams({ pid }))
      .then(res => {
        if (!res.ok)
          throw new Error('Cannot connect to the server');
        return res;
      })
      .then(res => res.json())
      .then(userInfo => {
        userInfo.forEach(info => {
          info['last_active_date'] = 
            moment(info['last_active_date']).format('MM-DD-YYYY')
        });
        setUsers(userInfo);
      })
      .catch(error => {
        showPopupMessage(error.message, 'danger');
      })
  }, []);

  return (
    <>
      <ProjectUserDialog showUser={showUser} setShowUser={setShowUser} selectedUser={selectedUser} />
      <AddUser addUserOpen={addUserOpen} setAddUserOpen={setAddUserOpen} />
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span
          style={{
            fontSize: '15px',
          }}
        >
          <Chip label={<b style={{ color: 'green' }}>Active User: 1</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
        </span>
        <Button type="button" color="info" onClick={() => setAddUserOpen(true)}>Add User</Button>
      </div>
      <GridContainer>
        {
          users.map(user => {
            return (
              <GridItem key={user['username']} xs={12} sm={12} md={3}>
                <Card
                  onClick={username !== user['username'] ? (() => selectUser(user)) : null}
                  className={ username !== user['username'] ? "clickable" : "project-owner" }
                >
                  <CardHeader color="warning" stats icon>
                    <CardIcon color="warning">
                      <AccountCircleIcon />
                    </CardIcon>
                    <p className={classes.cardCategory}>
                      {user['username']}
                    </p>
                    <h3 className={classes.cardTitle}>
                      {user['first_name']} {user['last_name']}
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      Last active: {user['last_active_date']}
                    </div>
                  </CardFooter>
                </Card>
              </GridItem>
            )
          })
        }
      </GridContainer>
    </>
  );
}