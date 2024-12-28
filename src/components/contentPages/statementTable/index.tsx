import React from 'react';
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
import { useNavigate } from "react-router-dom";
import { GlobalLoadingContextType, useGlobalLoading } from '../../loading/global-loading/provider';
import { useExpenses, UserExpensesDataCoxtextType } from '../../expenses-provider';
import { ExpenseTypeResponse } from '../../../integration/fin-tool-api/responses';
import FabButtonMenu from '../FabButtonMenu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from "@mui/styles";

export interface StatementTable {
  sheetId: number
}

const useStyles = makeStyles(theme => ({
  root: {},

  border: {
    borderWidth: '1px',
    borderColor: 'rgba(81, 81, 81, 1)',
    borderStyle: 'solid',
  },
}));

const StatementTable: React.FC<StatementTable> = (statementTable: StatementTable) => {

  const classes = useStyles();
  const navigate = useNavigate();
  const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
  // const { executeStatelessRequest: deleteExpenseRequest } = useApiRequestStatelessHook({apiRequest: deleteExpense})

  const {
    expensesData
  } = useExpenses() as UserExpensesDataCoxtextType;

  interface Column {
    id: 'id' | 'description' | 'amount' | 'expenseType' | 'datPurchase';
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: any) => string;
  }

  const columns: Column[] = [
    { id: 'description', label: 'Descrição', align: "center" },
    { id: 'amount', label: 'Valor', align: "center", format: (value: any) => `${formatBRLCurrency(value)}` },
    { id: 'expenseType', label: 'Categoria', align: "center" },
    { id: 'datPurchase', label: 'Data', align: "center", format: (value: any) => dayjs(value).format('DD/MM/YYYY') },
    // { id: 'id', label: '', align: "center", format: (value: any) => buildSettingsColumn(value) }
  ];

  // const updateExpense = (id: number) => {
  //   selectExpenseToUpdate(id);
  // }

  // const removeExpense = async (id) => {
  //   startLoading();
  //   await deleteExpenseRequest(id)
  //     .then(res => refreshPageData())
  //     .catch(err => {})
  //     .finally(() => finishLoading());
  // }

  const buildSettingsColumn = (id: number) => {
    return (
      <Box display="flex">
        <Tooltip title="Editar">
          <IconButton onClick={() => console.log(id)}>
            <ModeEditOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remover">
          <IconButton onClick={() => console.log(id)}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }



  return (
    <Box p={3}>
      <Typography
        variant='h5'
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          fontWeight: '600',
          textAlign: 'center',
          color: 'white'
        }}
        mb={2}
      >
        Despesas
      </Typography>
      <Paper
        sx={{
          marginBottom: '2em',
          maxHeight: '35em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <TableContainer>
          <Table sx={{ borderRadius: '10px' }} stickyHeader aria-label="sticky table">
            <TableHead sx={{ borderRadius: '10px' }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={{ fontWeight: 'bold' }}
                    key={column.id}
                    align="center"
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody >
              {expensesData && expensesData.content
                .map((row) => {
                  return (
                    <TableRow
                     sx={{cursor: 'pointer'}}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                    >
                      {columns.map((column) => {
                        let value = row[column.id];
                        let isFixed = row['isFixedExpense'];
                        if (column.id === 'expenseType') {
                          value = (value as ExpenseTypeResponse).name
                        };
                        return (
                          <TableCell
                            key={column.id} align="center">
                            {column.format ? column.format(value) : value.toString()}
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
          sx={{ height: '5em' }}
          rowsPerPageOptions={[8]}
          component="div"
          count={(expensesData && expensesData.totalElements) || 0}
          rowsPerPage={8}
          page={expensesData && expensesData.number || 0}
          onPageChange={(e, newPage) => console.log(newPage)}
        />
      </Paper>
      <FabButtonMenu options={[
        { label: 'Criar', onClick: () => console.log(1), Icon: AddIcon, color: 'info', show: true },
        { label: 'Editar', onClick: () => console.log(2), Icon: EditIcon, color: 'info', show: true },
        { label: 'Remover', onClick: () => console.log(3), Icon: DeleteIcon, color: 'info', show: true }
      ]} />
    </Box>


  );
};
export default StatementTable;