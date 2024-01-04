import { React, useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';

// const columns = [
//     { field: 'description', headerName: 'Descrição', sortable: false, },
//     { field: 'amount', headerName: 'Valor', sortable: false, },
//     { field: 'expenseCategory', headerName: 'Categoria', valueGetter: (params) =>  params.row.expenseCategory.name, sortable: false, },
//     { field: 'datPurchase', headerName: 'Data', sortable: false, }
//   ];

const columns = [
  { id: 'description', label: 'Descrição', align: 'center' },
  { id: 'amount', label: 'Valor', align: 'center', format: (value) => `R$${value.toFixed(2)}` },
  { id: 'expenseCategory', label: 'Categoria', align: 'center' },
  { id: 'datPurchase', label: 'Data', align: 'center' }
];


const StatementTable = ({ expenseList }) => {

  const [userExpenses, setUserExpenses] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  
  return (
    <div>
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
          <Table sx={{borderRadius: '10px'}} stickyHeader aria-label="sticky table">
            <TableHead sx={{borderRadius: '10px'}}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={{fontWeight: 'bold'}}
                    key={column.id}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {expenseList
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
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
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

          rowsPerPageOptions={[8]}
          component="div"
          count={expenseList.length}
          rowsPerPage={8}
          page={0}
          // sx={{position: 'absolute', margin: 0}}
          // onPageChange={handleChangePage}
          // onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    </div>
  );
};
export default StatementTable;