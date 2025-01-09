import React from 'react';
import { Box, Modal, Paper, Tooltip, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';
import dayjs from 'dayjs';
import { ExpenseTypeResponse } from '../../../integration/fin-tool-api/responses';
import FabButtonMenu from '../FabButtonMenu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpenseForm from '../expenseForm';
import { StatementTableParams, useStatementTableAdapter } from './adapter';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import PushPinIcon from '@mui/icons-material/PushPin';


const StatementTable: React.FC<StatementTableParams> = (params: StatementTableParams) => {

  const {
    selectedExpense,
    setSelectedExpense,
    createNewExpense,
    updateExpense,
    closeExpenseGroupModal,
    isExpenseModalOpen,
    removeExpense,
    expensesData,
    rowsPerPage,
    updateRowsPerPage,
    pageNumber,
    setPageNumber,
    expenseFormAction,
  } = useStatementTableAdapter(params);

  const formatRecurringColumn = (value: any) => (
    <>
      {value && <Tooltip title="Despesa Fixa"> 
        <PushPinIcon /> 
      </Tooltip>}
    </>
  )

  interface Column {
    id: 'id' | 'description' | 'amount' | 'expenseType' | 'datPurchase' | 'isFixedExpense';
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: any) => any;
  }

  const columns: Column[] = [
    { id: 'description', label: 'Descrição', align: "center" },
    { id: 'amount', label: 'Valor', align: "center", format: (value: any) => `${formatBRLCurrency(value)}` },
    { id: 'expenseType', label: 'Categoria', align: "center" },
    { id: 'datPurchase', label: 'Data', align: "center", format: (value: any) => dayjs(value).format('DD/MM/YYYY') },
    { id: 'isFixedExpense', label: '', align: "center", format: (value: any) => formatRecurringColumn(value) },
  ];


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
        Meus Gastos
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
                    key={column.id}
                    align="center"
                  >
                    <Typography
                      fontWeight='bold'
                    >
                      {column.label}
                    </Typography>

                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody >
              {expensesData && expensesData.content
                .map((row) => {
                  return (
                    <TableRow
                      onClick={(_e) => setSelectedExpense(row.id)}
                      sx={{ cursor: 'pointer' }}
                      hover
                      selected={row.id === selectedExpense}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                    >
                      {columns.map((column) => {
                        let value = row[column.id];
                        if (column.id === 'expenseType') {
                          value = (value as ExpenseTypeResponse).name
                        };
                        return (
                          <TableCell
                            key={column.id} align="center">
                            <Typography
                            >
                              {column.format ? column.format(value) : value.toString()}
                            </Typography>
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
          labelRowsPerPage="Registros por página:"
          sx={{ height: '5em' }}
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={(expensesData && expensesData.page.totalElements) || 0}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => updateRowsPerPage(event.target.value as unknown as number)}
          page={pageNumber}
          onPageChange={(_e, newPage) => setPageNumber(newPage)}
        />
      </Paper>
      <FabButtonMenu options={[
        { label: 'Criar', onClick: () => createNewExpense(), Icon: AddIcon, color: 'info', show: true },
        { label: 'Editar', onClick: () => updateExpense(), Icon: EditIcon, color: 'info', show: selectedExpense !== null },
        { label: 'Remover', onClick: () => removeExpense(), Icon: DeleteIcon, color: 'info', show: selectedExpense !== null }
      ]}
      />
      <Modal
        open={isExpenseModalOpen}
        onClose={(_e) => closeExpenseGroupModal()}
        aria-labelledby="modal-expense-register"
        aria-describedby="modal-form-to-register-or-edit-user-expenses"
      >
        <ExpenseForm
          action={expenseFormAction}
          sheetId={params.sheetId}
          expenseId={selectedExpense}
          closeForm={closeExpenseGroupModal} 
        />
      </Modal>
    </Box>
  );
};
export default StatementTable;