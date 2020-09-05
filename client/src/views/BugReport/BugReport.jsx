import React from 'react';
// @material-ui
import Chip from '@material-ui/core/Chip';
// widgets
import moment from 'moment'
// core
import EnhancedTable from 'components/EnhancedTable/EnhancedTable';
import Button from 'components/CustomButtons/Button';
import NewBug from 'components/NewBug/NewBug';
import EditBug from 'components/EditBug/EditBug';

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
  // states
  const [createBugOpen, setCreateBugOpen] = React.useState(false);
  const [editBugOpen, setEditBugOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  // functions
  const createBug = (data) => {
    fetch('/api/project/create-bug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({pid: props.match.params.pid, ...data})
    })
    .then(res => {
      if (!res.ok) {
        props.setMessage('Server error');
      } else {
        window.location.reload();
      }
    });
  }

  const handleClick = (bid) => {
    setEditBugOpen(true);
  }

  // initialize
  React.useEffect(() => {
    fetch('/api/project/get-bugs?' + new URLSearchParams({ pid: props.match.params.pid }))
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
      <NewBug createBugOpen={createBugOpen} setCreateBugOpen={setCreateBugOpen} createBug={createBug} />
      <EditBug editBugOpen={editBugOpen} setEditBugOpen={setEditBugOpen} />
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