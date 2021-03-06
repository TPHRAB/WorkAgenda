// @material-ui
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';


const HeadCell = withStyles(() => ({
  head: {
    borderBottomColor: '#97A1A1',
  }
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));


function EnhancedTableHead(props) {
  const { headCells, classes, order, orderBy, onRequestSort } = props;

  // functions
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <HeadCell
            key={headCell.id}
            align='left'
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {
              headCell.date ? (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.label
              )
            }
          </HeadCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable(props) {
  const { headCells, rows, idColumn, handleClick, dateCells } = props;
  const classes = useStyles();

  // states
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(dateCells['default']);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // functions
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const descendingComparator = (a, b, orderBy) => {
    return b[dateCells[orderBy]] - a[dateCells[orderBy]]
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Card>
      <CardBody>
        <Table
          aria-labelledby="tableTitle"
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={headCells}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(row[idColumn])}
                    role="checkbox"
                    tabIndex={-1}
                    key={row[idColumn]}
                  >
                    {
                      headCells.map((cell) => {
                        return (
                          <TableCell className={classes[cell.columnClass]} key={cell.id}>
                          {
                              cell.isLink ? (
                              <a>
                                  {row[cell.id]}
                              </a>
                              ) : (
                                row[cell.id]
                              )
                          }
                          </TableCell>
                        )
                      })
                    }
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </CardBody>
    </Card>
  );
}