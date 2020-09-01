import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

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
  },
  emptyList: {
    color: '#D3D3D3'
  }
});

export default function WorkItems(props) {
  const classes = useStyles();
  const rows = props.rows; // {usericon, title, type, message}

  return (
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell className={classes.emptyList} align="center">No upcoming work</TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell className={classes.userIconColumn} >
                  {row.userIcon}
                </TableCell>
                <TableCell align="left">{row.title}</TableCell>
                <TableCell align="right">
                  {row.type}
                </TableCell>
                <TableCell align="right" className={classes.dateColumn}>
                    {row.message}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
  );
}