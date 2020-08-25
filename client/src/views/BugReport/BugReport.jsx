import React from 'react';
import EnhancedTable from 'components/EnhancedTable/EnhancedTable';

const headCells = [
  { id: 'bug', label: 'BUG', isLink: true },
  { id: 'reporter', label: 'REPORTER' },
  { id: 'created-date', label: 'CREATED DATE', date: true },
  { id: 'status', label: 'STATUS' },
  { id: 'assignee', label: 'ASSIGNEE' },
  { id: 'due date', label: 'DUE DATE', date: true },
  { id: 'severity', label: 'SEVERITY' },
];

function createData(bug, reporter, createdDate, status, assignee, dueDate, severity) {
  return { bug, reporter, createdDate, status, assignee, dueDate, severity };
}

const rows = [
  createData('This is a bugThis is a bugThis is a bugThis is a bugThis is a bug', 'Me', '08-15-2020', 'open', 'Me', <span style={{color: 'red'}}>08-18-2020 04:00 PM</span>, 'None'),
];

export default function BugReport() {
  return (
    <EnhancedTable headCells={headCells} rows={rows} />
  );
}