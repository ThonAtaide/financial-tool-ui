import { React, useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import ResponsiveAppBar from '../header'
import { Box, Grid, Typography, Fab, Modal, TextField, Button, Alert, Pagination, PaginationItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { registerUserExpense, fetchUserExpenses, updateExpense, fetchUserExpensesGroupedByCategory } from '../../utils/backend-client';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { ArrowDropDownIcon, DatePicker } from '@mui/x-date-pickers';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import StatementTable from './statementTable';
import CustomPieChart from './customPieChart';
import UserBalancePane from './balance';
// import ExpenseGroupCard from './expenseGroupCard';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 400,
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  p: 4
};

const HomePage = () => {
  // const expenses = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const [userExpenses, setUserExpenses] = useState([]);
  const [userExpensesGroupedByCategory, setUserExpensesGroupedByCategory] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [currentExpenseGroup, setCurrentExpenseGroup] = useState(null);
  const [isExpenseGroupModalOpen, setExpenseGroupModalOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [reportDateRange, setReportDateRange] = useState(dayjs(new Date()));

  const selectReportDateRange = (value) => {
    if (value != reportDateRange) {
      setReportDateRange(value);
    }
  }

  const selectExpenseGroupToEdit = (expenseGroup) => {
    setCurrentExpenseGroup(expenseGroup);
    setExpenseGroupModalOpen(true);
  }

  const createNewExpenseGroup = () => {
    console.log(userExpenses)
    setCurrentExpenseGroup({ name: '' });
    setExpenseGroupModalOpen(true);
  }

  const closeExpenseGroupModal = () => {
    setCurrentExpenseGroup(null);
    setExpenseGroupModalOpen(false);
  }

  const onChangeExpenseGroupName = (value) => {
    setCurrentExpenseGroup({ ...currentExpenseGroup, name: value });
  }

  const expenseGroupModalSave = () => {

    if (currentExpenseGroup && !currentExpenseGroup.id) {
      registerUserExpense(currentExpenseGroup)
        .catch(err => console.log('Deu erro'))
        .finally(res => navigate(0)); //TODO SHOW MESSAGE ON ERROR        
    } else if (currentExpenseGroup && currentExpenseGroup.id) {
      console.log(currentExpenseGroup)
      updateExpense({ expenseGroupId: currentExpenseGroup.id, expenseGroup: currentExpenseGroup })
        .catch(err => console.log(err))
        .finally(res => navigate(0)); //TODO SHOW MESSAGE ON ERROR 
    }
    closeExpenseGroupModal();
  }

  const loadUserExpenses = () => {
    const until = reportDateRange.startOf('month').format('YYYY-MM-DD')
    const from = reportDateRange.endOf('month').format('YYYY-MM-DD');
    fetchUserExpenses({ page: pageNumber, pageSize, from, until })
      .then(response => {
        console.log('Deu certo')
        console.log(response)
        setUserExpenses(response.content);
        setTotalElements(response.totalElements);
      })
      .catch(err => {
        if (err && err.status === 401) {
          navigate("/login");
        }
        console.log('ERRO')
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
    const searchParams = new URLSearchParams(location.search);
    setPageNumber(parseInt(value));
    navigate(`../?page=${value}&pageSize=${pageSize}`)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page') || 1;
    const pageSize = searchParams.get('pageSize') || 10;
    setPageNumber(parseInt(page));
    setPageSize(pageSize);
  }, []);

  useEffect(() => {
    loadUserExpenses();
    loadUserExpensesGroupedByCategory();
  }, [reportDateRange]);


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
        >
          <Grid
            key='extrato'
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
            <StatementTable expenseList={userExpenses} />
          </Grid>
          <Grid
            key='extrato'
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
      {/* <Box 
        maxWidth
        display='flex'
        justifyContent='center'
      >
        <Pagination 
        size='large'
          style={{bottom: '3rem', position: 'fixed'}} 
          count={totalElements} 
          page={pageNumber} 
          onChange={handlePageChange} 
        />
      </Box> */}

      <Modal
        open={isExpenseGroupModalOpen}
        onClose={closeExpenseGroupModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{
              fontFamily: 'var(--bs-font-sans-serif)',
              fontWeight: '600'
            }}
          >
            Grupo de Despesa
          </Typography>
          <TextField
            id="group-name-field"
            fullWidth
            label="Nome do Grupo"
            variant="standard"
            size='small'
            value={currentExpenseGroup && currentExpenseGroup.name}
            onChange={(e) => onChangeExpenseGroupName(e.target.value)}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={expenseGroupModalSave} variant='contained'>
              Salvar
            </Button>
            <Button onClick={closeExpenseGroupModal} color='error' variant='contained' sx={{ marginLeft: '1rem' }}>
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default HomePage;