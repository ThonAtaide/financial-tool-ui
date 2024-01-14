import { React } from 'react';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';
import dayjs from 'dayjs';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { deleteExpense } from '../../../utils/backend-client/expenses';
import { useNavigate } from "react-router-dom";

const StatementTable = ({ expensesPage, changePage, pageRefresh, selectExpenseToUpdate }) => {

  const navigate = useNavigate();
  const columns = [
    { id: 'description', label: 'Descrição', align: 'center' },
    { id: 'amount', label: 'Valor', align: 'center', format: (value) => `${formatBRLCurrency(value)}` },
    { id: 'expenseCategory', label: 'Categoria', align: 'center' },
    { id: 'datPurchase', label: 'Data', align: 'center', format: (value) => dayjs(value).format('DD/MM/YYYY') },
    { id: 'id', label: '', align: 'center', format: (value) => buildSettingsColumn(value) }
  ];

  const updateExpense = (id) => {
    selectExpenseToUpdate(id);
  }

  const removeExpense = (id) => {
    deleteExpense({expenseId: id, unnathorized_redirect: () => navigate("/login")})
      .then(() => pageRefresh())
      .catch(err => console.log(err));
  }
  
  const buildSettingsColumn = (id) => {
    return (
      <Box display="flex">
        <Tooltip title="Editar">
          <IconButton onClick={() => updateExpense(id)}>
            <ModeEditOutlineOutlinedIcon sx={{ cursor: 'pointer' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remover">
          <IconButton onClick={() => removeExpense(id)}>
            <DeleteOutlinedIcon sx={{ cursor: 'pointer' }} />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

  return (
    <Box >
      <Typography
        variant='h5'
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          fontWeight: '600'
        }}
        mb={2}
      >
        Despesas
      </Typography>
      <Paper
        maxWidth
        sx={{
          height: '32em',
          maxHeight: '32em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <TableContainer >
          <Table sx={{ borderRadius: '10px' }} stickyHeader aria-label="sticky table">
            <TableHead sx={{ borderRadius: '10px' }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={{ fontWeight: 'bold' }}
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {expensesPage && expensesPage.content
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        let value = row[column.id];
                        if (column.id === 'expenseCategory') {
                          value = value.name
                        };
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[7]}
          component="div"
          count={(expensesPage && expensesPage.totalElements) || 0}
          rowsPerPage={7}
          page={expensesPage && expensesPage.pageable && expensesPage.pageable.pageNumber}
          onPageChange={(e, newPage) => changePage(e, newPage)}
        />
      </Paper>
    </Box>
  );
};
export default StatementTable;