import React from 'react';
// @material-ui
import Chip from '@material-ui/core/Chip';
// core
import EnhancedTable from 'components/EnhancedTable/EnhancedTable';
import Button from 'components/CustomButtons/Button';
import NewBug from 'components/NewBug/NewBug';

const headCells = [
  { id: 'title', label: 'BUG', isLink: true },
  { id: 'reporter', label: 'REPORTER' },
  { id: 'created_date', label: 'CREATED DATE', date: true },
  { id: 'status', label: 'STATUS' },
  { id: 'assignee', label: 'ASSIGNEE' },
  { id: 'due_date', label: 'DUE DATE', date: true },
  { id: 'severity', label: 'SEVERITY' },
];

function createData(bug, reporter, createdDate, status, assignee, dueDate, severity) {
  return { bug, reporter, createdDate, status, assignee, dueDate, severity };
}

const rows = [
  createData('This is a bugThis is a bugThis is a bugThis is a bugThis is a bug', 'Me', '08-15-2020', 'open', 'Me', <span style={{color: 'red'}}>08-18-2020 04:00 PM</span>, 'None'),
];

export default function BugReport(props) {
  // states
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  // functions

  // initialize
  React.useEffect(() => {
    fetch('/api/project/get-bugs?' + new URLSearchParams({ pid: props.match.params.pid }))
      .then(res => res.json())
      .then(obj => setRows(obj));
  }, []);

  return (
    <>
      <NewBug popupOpen={popupOpen} setPopupOpen={setPopupOpen} />
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <span
          style={{
            fontSize: '15px',
          }}
        >
          <Chip label={<b style={{ color: 'green' }}>Open: 1</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
          <Chip label={<b style={{ color: 'grey' }}>Closed: 0</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
        </span>
        <Button type="button" color="info" onClick={() => setPopupOpen(true)}>Submit Bug</Button>
      </div>
      <EnhancedTable headCells={headCells} rows={rows} idColumn='bid' />
    </>
  );
}