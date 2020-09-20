import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import TextField from "@material-ui/core/TextField";
import AddIcon from '@material-ui/icons/Add';
// core components
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import Button from "components/CustomButtons/Button.js";

const useStyles = makeStyles(styles);

export default function Tasks(props) {
  const classes = useStyles();
  const {tasks, syncNotes, setNotes} = props;
  const [editIndex, setEditIndex] = React.useState(-1);

  const cancel = () => {
    setEditIndex(-1);
  }

  const update = (index) => {
    setEditIndex(-1);
    editField = editField.trim();
    if (tasks[index] !== editField && editField.length > 0) {
      let newState = tasks.map((item, i) => {
        if (i == index)
          return editField;
        else
          return item;
      });
      syncNotes(newState);
    }
  }

  const remove = (index) => {
    setEditIndex(-1);
    let newState = tasks.filter((item, i) => i != index );
    syncNotes(newState);
  }

  const add = () => {
    let newState = tasks.concat('');
    setEditIndex(tasks.length);
    setNotes(newState);
  }

  let editField = '';
  
  return (
    <>
      <Table className={classes.table}>
        <TableBody>
          {tasks.map((value, index) => (
            <TableRow key={value} className={classes.tableRow}>
              <TableCell className={classes.tableCell}>
                {
                  editIndex === index ? (
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      defaultValue={value}
                      fullWidth
                      onChange={(event) => {
                        editField = event.target.value
                      }}
                    />
                  ) : value
                }
              </TableCell>
              <TableCell className={classes.tableActions} align="right">
                { editIndex !== index ? (
                    <Tooltip
                      id="tooltip-top"
                      title="Edit Task"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                      onClick={() => setEditIndex(index)}
                    >
                      <IconButton
                        aria-label="Edit"
                        className={classes.tableActionButton}
                      >
                        <Edit
                          className={
                            classes.tableActionButtonIcon + " " + classes.edit
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      id="tooltip-top"
                      title="Confirm Edit"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                      onClick={() => update(index)}
                    >
                      <IconButton
                        aria-label="Edit"
                        className={classes.tableActionButton}
                      >
                        <Check
                          className={
                            classes.tableActionButtonIcon + " " + classes.edit
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  )
                }
                <Tooltip
                  id="tooltip-top-start"
                  title={editIndex === index ? "Cancel" : "Remove"}
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                  onClick={editIndex === index ? () => cancel() : () => remove(index)}
                >
                  <IconButton
                    aria-label="Close"
                    className={classes.tableActionButton}
                  >
                    <Close
                      className={
                        classes.tableActionButtonIcon + " " + classes.close
                      }
                    />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <span className={classes.buttonWrapper}>
        <Button
          type="button"
          color="success"
          className={classes.button}
          onClick={add}
        >
            <AddIcon />Add
        </Button>
      </span>
    </>
  );
}

Tasks.propTypes = {
  tasksIndexes: PropTypes.arrayOf(PropTypes.number),
  tasks: PropTypes.arrayOf(PropTypes.node),
};
