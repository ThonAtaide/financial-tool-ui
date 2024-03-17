import { React, useEffect, useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import ResponsiveAppBar from '../header'
import { Box, Grid, Typography, Fab, Modal, Alert, Backdrop, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fetchUserExpenses, fetchUserExpensesGroupedByCategory, fetchUserExpensesGroupedByFixedOrNot } from '../../utils/backend-client/expenses';
import dayjs from 'dayjs';
import { ArrowDropDownIcon, DatePicker } from '@mui/x-date-pickers';
import StatementTable from './statementTable';
import CustomPieChart from './customPieChart';
import UserBalancePane from './balance';
import ExpenseForm from './expenseForm';
import 'dayjs/locale/pt-br';
import { useApiRequestWithStateResult } from '../hook/api-request-statefull';
import { useExpenses } from './expenses-provider';


const HomePage = () => {
  const navigate = useNavigate();
  const {
    selectedExpensesMonth,
    updateSelectedExpensesMonth,
    updateSelectedCategories,
    userStatementPageNumber,
    updateUserStatementPageNumber,
    userExpensesStatementData,
    isLoadinguserExpensesStatementData,
    userExpensesSumByCategoryData,
    isLoadingUserExpensesSumByCategoryData,
    loadUserExpensesSumByCategoryData,
    userExpensesSumByFixedOrNot,
    isLoadingUserExpensesSumByFixedOrNot,
    loadUserExpensesGroupedByFixedOrNot,
    refreshPageData,
  } = useExpenses();
  
  const [idFromExpenseToUpdate, setIdFromExpenseToUpdate] = useState(null);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

  const getUserBalance = () => {
    return userExpensesSumByCategoryData 
      && userExpensesSumByCategoryData.length > 0
      && userExpensesSumByCategoryData
      .map(item => item.amount)
      .reduce((total, item) => total + item) || 0;
  }

  const getUserExpensesByCategoryDataFormatted = () => {
    return userExpensesSumByCategoryData && userExpensesSumByCategoryData.map((item) => {
      return { id: item.identifier, label: item.label, value: item.amount }
    });
  }

  const getUserExpenseOrNotFormatted = () => {
    if (!userExpensesSumByFixedOrNot) {
      return { amountTotal: 0, fixedTotal: 0 }
    }
    const amountTotal = userExpensesSumByFixedOrNot
      .reduce((total, item) => total + item.amount, 0); 
    const fixedExpenseAmountTotal = userExpensesSumByFixedOrNot
    .filter(item => item.label === 'Fixed').reduce((total, item) => total + item.amount, 0);
    return({ amountTotal, fixedTotal: fixedExpenseAmountTotal });
  }

  const selectExpenseToUpdate = (id) => {
    setIdFromExpenseToUpdate(id);
    setExpenseModalOpen(true);
  }

  const cleanExpenseToUpdate = () => {
    setIdFromExpenseToUpdate(null);
  }

  const createNewExpense = () => {
    setExpenseModalOpen(true);
  }

  const closeExpenseGroupModal = (refresh = false) => {
    if (refresh) refreshPageData();
    cleanExpenseToUpdate();
    setExpenseModalOpen(false);
  }

  

  return (
    <Box >
      <ResponsiveAppBar />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoadinguserExpensesStatementData || isLoadingUserExpensesSumByCategoryData || isLoadingUserExpensesSumByFixedOrNot}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      <Box
        padding={4}
        sx={{
          display: { xs: 'flex', md: 'flex', justifyContent: 'space-between' }
        }}
      >
        <Typography
          variant='h4'
          sx={{
            fontFamily: 'var(--bs-font-sans-serif)',
            fontWeight: '600'
          }}
        >
          Minhas Despesas
        </Typography>
        <DatePicker
          onAccept={(e) => updateSelectedExpensesMonth(e)}
          value={dayjs(selectedExpensesMonth)}
          views={['month', 'year']}
          slots={{
            openPickerIcon: ArrowDropDownIcon
          }}
        />
      </Box>
      <Box        
        display='flex'
        justifyContent='center'
        padding={4}
      >
        <Grid
          container
          spacing={2}
          border='solid'
          borderRadius={2}
          padding={2}
          sx={{ backgroundColor: '#e9f0ff', borderWidth: 'thin', borderColor: '#a3a3a3' }}
          pb={5}
        >
          {getUserExpensesByCategoryDataFormatted() && getUserExpensesByCategoryDataFormatted().length > 0 && <Grid
            key='pieChart'
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={4}
            pt={5}
            sx={{ textAlign: 'center' }}
          >
            <CustomPieChart title="Despesas por categoria" data={getUserExpensesByCategoryDataFormatted()} />
          </Grid>}
          {userExpensesStatementData && <Grid
            key='extrato'
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={4}
            pt={5}
            sx={{ textAlign: 'center' }}
          >
            <StatementTable
              expensesPage={userExpensesStatementData}
              selectExpenseToUpdate={selectExpenseToUpdate}
            />
          </Grid>}
          {userExpensesSumByFixedOrNot && <Grid
            key='balance'
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={4}
            pt={5}
            sx={{ textAlign: 'center' }}
          >
            <UserBalancePane balance={getUserBalance()} fixedExpenseInfo={getUserExpenseOrNotFormatted()} />
          </Grid>}
        </Grid>
      </Box>
      <Fab
        color="primary"
        aria-label="add"
        onClick={createNewExpense}
        sx={{ position: 'fixed', bottom: 16, right: 16, height: '6rem', width: '6rem' }}
      >
        <AddIcon sx={{ height: '3rem', width: '3rem' }} />
      </Fab>

      <Modal
        open={isExpenseModalOpen}
        onClose={closeExpenseGroupModal}
        aria-labelledby="modal-expense-register"
        aria-describedby="modal-form-to-register-or-edit-user-expenses"
      >
        <>
        <ExpenseForm  
          expenseIdentifier={idFromExpenseToUpdate} 
          closeExpenseFormModal={closeExpenseGroupModal} 
          />
          </>
      </Modal>
    </Box>
  );
}

export default HomePage;