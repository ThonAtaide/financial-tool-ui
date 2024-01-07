import { React, useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import ResponsiveAppBar from '../header'
import { Box, Grid, Typography, Fab, Modal, TextField, Button, Alert, Pagination, PaginationItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fetchUserExpenses, updateExpense, fetchUserExpensesGroupedByCategory } from '../../utils/backend-client';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { ArrowDropDownIcon, DatePicker } from '@mui/x-date-pickers';
import StatementTable from './statementTable';
import CustomPieChart from './customPieChart';
import UserBalancePane from './balance';
import ExpenseForm from './expenseForm';


const HomePage = () => {
  // const expenses = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const [userExpensesPage, setUserExpensesPage] = useState(null);
  const [userExpensesGroupedByCategory, setUserExpensesGroupedByCategory] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [idFromExpenseToUpdate, setIdFromExpenseToUpdate] = useState(null);

  const [currentExpenseGroup, setCurrentExpenseGroup] = useState(null);
  const [isExpenseGroupModalOpen, setExpenseGroupModalOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(7);
  const [reportDateRange, setReportDateRange] = useState(dayjs(new Date()));

  const selectReportDateRange = (value) => {
    if (value != reportDateRange) {
      setReportDateRange(value);
    }
  }

  const selectExpenseToUpdate = (id) => {
    setIdFromExpenseToUpdate(id);
    setExpenseGroupModalOpen(true);
  }

  const cleanExpenseToUpdate = () => {
    setIdFromExpenseToUpdate(null);
  }

  const selectExpenseGroupToEdit = (expenseGroup) => {
    setCurrentExpenseGroup(expenseGroup);
    setExpenseGroupModalOpen(true);
  }

  const createNewExpenseGroup = () => {
    setCurrentExpenseGroup({ name: '' });
    setExpenseGroupModalOpen(true);
  }

  const closeExpenseGroupModal = (refresh = false) => {
    if (refresh) pageRefresh();
    setIdFromExpenseToUpdate(null);
    setCurrentExpenseGroup(null);
    setExpenseGroupModalOpen(false);
  }

  const onChangeExpenseGroupName = (value) => {
    setCurrentExpenseGroup({ ...currentExpenseGroup, name: value });
  }  

  const loadUserExpenses = () => {
    const until = reportDateRange.startOf('month').format('YYYY-MM-DD')
    const from = reportDateRange.endOf('month').format('YYYY-MM-DD');
    fetchUserExpenses({ page: pageNumber, pageSize, from, until })
      .then(response => {
        setUserExpensesPage(response);
      })
      .catch(err => {
        if (err && err.status === 401) {
          navigate("/login");
        }
      });
  }

  const loadUserExpensesGroupedByCategory = () => {
    const from = reportDateRange.format('YYYY-MM')
    fetchUserExpensesGroupedByCategory({ from })
      .then(response => {
        var data = [];
        var balance = 0;
        if (response) {
          response.forEach((item) => {
            balance += item.amount;
            data.push({ id: item.label, label: item.label, value: item.amount })
          });
        }

        setUserExpensesGroupedByCategory(data);
        setUserBalance(balance);
      })
      .catch(err => {
        if (err && err.status === 401) {
          navigate("/login");
        }
        console.log('ERRO')
      });
  }

  const handlePageChange = (event, value) => { 
    setPageNumber(parseInt(value));
  }

  const pageRefresh = () => {    
    loadUserExpenses();
    loadUserExpensesGroupedByCategory();
  }

  useEffect(() => {
    pageRefresh();
  }, [reportDateRange]);

  useEffect(() => {
    loadUserExpenses();
  }, [pageNumber]);

  return (
    <Box >
      <ResponsiveAppBar />
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
          onAccept={(e) => selectReportDateRange(e)}
          value={dayjs(reportDateRange)}
          views={['month', 'year']}
          slots={{
            openPickerIcon: ArrowDropDownIcon
          }}
        />
      </Box>
      <Box 
        maxWidth
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
          <Grid
            key='pieChart'
            item
            xs={12}
            lg={4}
            padding={5}
            sx={{ textAlign: 'center' }}
          >
            <CustomPieChart title="Despesas por categoria" data={userExpensesGroupedByCategory} />
          </Grid>
          <Grid
            key='extrato'
            item
            xs={12}
            lg={4}
            sx={{ textAlign: 'center' }}
          >
            <StatementTable 
              expensesPage={userExpensesPage} 
              changePage={handlePageChange} 
              pageRefresh={pageRefresh}
              selectExpenseToUpdate={selectExpenseToUpdate}
            />
          </Grid>
          <Grid
            key='balance'
            item
            xs={12}
            lg={4}
            padding={5}
            sx={{ textAlign: 'center' }}
          >
            <UserBalancePane balance={userBalance} />
          </Grid>
        </Grid>
      </Box>
      <Fab
        color="primary"
        aria-label="add"
        onClick={createNewExpenseGroup}
        sx={{ position: 'fixed', bottom: 16, right: 16, height: '6rem', width: '6rem' }}>
        <AddIcon sx={{ height: '3rem', width: '3rem' }} />
      </Fab>      

      <Modal
        open={isExpenseGroupModalOpen}
        onClose={closeExpenseGroupModal}        
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ExpenseForm expenseIdentifier={idFromExpenseToUpdate} closeExpenseFormModal={closeExpenseGroupModal}/>
      </Modal>
    </Box>
  );
}

export default HomePage;