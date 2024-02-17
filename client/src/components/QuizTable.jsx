import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function QuizTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [quizzes, setQuizzes] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3001/quizzes');
      const data = await response.json();
      setQuizzes(data);
    }
    fetchData();
  }
  , []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/quizzes/${id}`, {
      method: 'DELETE'
    });
    const response = await fetch('http://localhost:3001/quizzes');
    const data = await response.json();
    setQuizzes(data);
  }

  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 4 }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Titre</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Date de création</TableCell>
            <TableCell align="right">Date de modification</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        {quizzes.length === 0 && <TableBody>
          <TableRow>
            <TableCell colSpan={6}><Alert severity="info">Aucun quiz trouvé</Alert></TableCell>
          </TableRow>
        </TableBody>}
        <TableBody>
          {quizzes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((quizz) => (
            <>
            <TableRow key={quizz.id}>
              <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                {quizz.title}
              </TableCell>
              <TableCell align="right">{quizz.description.length > 50 ? quizz.description.substring(0, 50) + "..." : quizz.description}</TableCell>
              <TableCell align="right">{quizz.createdAt}</TableCell>
              <TableCell align="right">{quizz.updatedAt}</TableCell>
              <TableCell align="right">
                <Button aria-label="delete" onClick={() => handleDelete(quizz.id)}>
                  <DeleteIcon />
                </Button>
                <Button aria-label="edit">
                  <EditIcon />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Réponses
                    </Typography>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={quizzes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
    />
    </Paper>
  );
}