import React, { useState, useEffect, useContext } from 'react';
// @material-ui
import Chip from '@material-ui/core/Chip';
// widgets
import moment from 'moment'
// core
import EnhancedTable from 'components/EnhancedTable/EnhancedTable';
import Button from 'components/CustomButtons/Button';
import NewBug from 'components/NewBug/NewBug';
import EditBug from 'components/EditBug/EditBug';
// context
import { ProjectContext } from 'layouts/Project';

const headCells = [
  { id: 'title', label: 'BUG', isLink: true },
  { id: 'reporter', label: 'REPORTER' },
  { id: 'created_date', label: 'CREATED DATE', date: true },
  { id: 'status', label: 'STATUS' },
  { id: 'due_date', label: 'DUE DATE', date: true },
  { id: 'severity', label: 'SEVERITY' },
];

const status = ['OPEN', 'CLOSED'];
const severity = ['NONE', 'MINOR', 'MAJOR', 'CRITICAL'];

function createData(bug, reporter, createdDate, status, assignee, dueDate, severity) {
  return { bug, reporter, createdDate, status, assignee, dueDate, severity };
}

const rows = [
  createData('This is a bugThis is a bugThis is a bugThis is a bugThis is a bug', 'Me', '08-15-2020', 'open', 'Me', <span style={{color: 'red'}}>08-18-2020 04:00 PM</span>, 'None'),
];

export default function BugReport(props) {
  // context
  const { pid } = useContext(ProjectContext);

  // states
  const [createBugOpen, setCreateBugOpen] = useState(false);
  const [editBugOpen, setEditBugOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedBid, setSelectedBid] = useState();
  // functions

  const handleClick = (bid) => {
    setEditBugOpen(true);
    setSelectedBid(bid);
  }

  // initialize
  useEffect(() => {
    fetch('/api/get-bugs?' + new URLSearchParams({ pid }))
      .then(res => res.json())
      .then(obj => {
        obj.forEach(row => {
          row['created_date'] = moment(row['created_date']).format('MM-DD-YYYY');
          row['due_date'] = moment(row['due_date']).format('MM-DD-YYYY');
          row['status'] = status[row['status']];
          row['severity'] = severity[row['severity']];
        });
        setRows(obj);
      });
  }, []);

  return (
    <>
      <NewBug createBugOpen={createBugOpen} setCreateBugOpen={setCreateBugOpen} />

      <EditBug setEditBugOpen={setEditBugOpen} bid={selectedBid} editBugOpen={editBugOpen} />

      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span
          style={{
            fontSize: '15px',
          }}
        >
          <Chip label={<b style={{ color: 'green' }}>Open: 1</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
          <Chip label={<b style={{ color: 'grey' }}>Closed: 0</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
        </span>
        <Button type="button" color="info" onClick={() => setCreateBugOpen(true)}>Submit Bug</Button>
      </div>
      <EnhancedTable headCells={headCells} rows={rows} idColumn='bid' handleClick={handleClick} />
    </>
  );
}