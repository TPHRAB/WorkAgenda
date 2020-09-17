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

const dateCells = { created_date: 'cDate', due_date: 'dDate', default: 'due_date' };

const status = ['OPEN', 'CLOSED'];
const severity = ['NONE', 'MINOR', 'MAJOR', 'CRITICAL'];

const createStatus = (code) => {
  let color;
  switch(code) {
    case 0: // open
      color = 'green';
      break;
    case 1: 
      color = 'grey';
      break;
  }
  return <span style={{color}}>{status[code]}</span>;
}

const createSeverity = (code) => {
  let color;
  switch(code) {
    case 0: // None
      color = 'grey';
      break;
    case 1: 
      color = '#ff9999';
      break;
    case 2:
      color = 'orange';
      break;
    case 3:
      color = 'red';
      break;
  }
  return <span style={{color}}>{severity[code]}</span>;
}

export default function BugReport(props) {
  // context
  const { pid, showPopupMessage } = useContext(ProjectContext);

  // states
  const [createBugOpen, setCreateBugOpen] = useState(false);
  const [editBugOpen, setEditBugOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedBid, setSelectedBid] = useState();
  const [openCount, setOpenCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);

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
        let open = 0;
        obj.forEach(row => {
          if (row['severity'] === 0)
            open++;
          let createdDate = moment(row['created_date']);
          row[dateCells['created_date']] = createdDate;
          row['created_date'] = createdDate.format('MM-DD-YYYY');

          let dueDate = moment(row['due_date']);
          row[dateCells['due_date']] = dueDate;
          row['due_date'] = dueDate.format('MM-DD-YYYY');

          row['status'] = createStatus(row['status']);
          row['severity'] = createSeverity(row['severity']);
        });
        setRows(obj);

        // set message bar
        setOpenCount(open);
        setClosedCount(obj.length - open);
      })
      .catch(error => 
        showPopupMessage(error.message, 'danger')
      );
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
          <Chip label={<b style={{ color: 'green' }}>Open: {openCount}</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
          <Chip label={<b style={{ color: 'grey' }}>Closed: {closedCount}</b>} onClick={() => {}} variant="outlined" style={{margin: '6px 5px 0px 10px'}}/>
        </span>
        <Button type="button" color="info" onClick={() => setCreateBugOpen(true)}>Submit Bug</Button>
      </div>
      <EnhancedTable headCells={headCells} rows={rows} idColumn='bid' handleClick={handleClick} dateCells={dateCells} />
    </>
  );
}