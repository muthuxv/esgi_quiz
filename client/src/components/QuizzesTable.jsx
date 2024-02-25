import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from "react-router-dom";
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

export default function QuizzesTable( { quizzes } ) {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRedirectToQuizz = async (id) => {
    navigate(`/quiz/${id}`);
  };
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 4 }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
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
              <TableCell component="th" scope="row">
                {quizz.title}
              </TableCell>
              <TableCell align="right">{quizz.description !== null && quizz.description.length > 50 ? quizz.description.substring(0, 50) + "..." : quizz.description}</TableCell>
              <TableCell align="right">{quizz.createdAt}</TableCell>
              <TableCell align="right">{quizz.updatedAt}</TableCell>
              <TableCell align="right">
                <Button aria-label="redirectToQuizz" onClick={() => handleRedirectToQuizz(quizz.id)}>
                  <SubdirectoryArrowRightIcon />
                </Button>
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