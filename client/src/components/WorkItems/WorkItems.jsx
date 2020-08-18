import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BugReportIcon from '@material-ui/icons/BugReport';

const useStyles = makeStyles({
  table: {
    userSelect: "none"
  },
  tableCell: {
    border: "none",
    fontSize: "14px"
  },
  userIconColumn: {
    width: "0px"
  },
  dateColumn: {
    whiteSpace: "nowrap"
  }
});

function createData(userIcon, task, type, lateDayCount) {
  let lateDayMessage = `late by ${lateDayCount} days`;
  return { userIcon, task, type, lateDayMessage };
}

const rows = [
  createData(<AccountCircleIcon />, 'This is an overdue task', <BugReportIcon />, 1),
];

export default function SimpleTable() {
  const classes = useStyles();

  return (
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell className={classes.userIconColumn} >
                {row.userIcon}
              </TableCell>
              <TableCell align="left">{row.task}</TableCell>
              <TableCell align="right">
                {row.type}
              </TableCell>
              <TableCell align="right" className={classes.dateColumn}>
                  {row.lateDayMessage}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
}