import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, InputLabel, MenuItem, Select, TextField, Typography, FormControl, FormControlLabel, Switch, Grid } from '@mui/material';

import { createUserExpenses, fetchExpenseCategories, getExpenseById, updateExpense } from '../../../utils/backend-client';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import dayjs from 'dayjs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '32em',
  maxWidth: '80%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  p: 4
};

const defaultMaskOptions = {
  prefix: 'R$',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.',
  allowDecimal: true,
  decimalSymbol: ',',
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 7, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false
}

const ExpenseForm = ({ closeExpenseFormModal, expenseIdentifier }) => {
  const navigate = useNavigate();

  const [expenseCategories, setExpenseCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(999999);

  const [expenseId, setExpenseId] = useState(expenseIdentifier || null);
  const [description, setDescription] = useState(null);
  const [amount, setAmount] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    fetchExpenseCategories({})
      .then(response => {
        console.log(response)
        const categories = response && response._embedded
          && response._embedded.expenseCategories.map(item => { return { id: item.id, name: item.name } }) || [];
        setExpenseCategories(categories);
      }).catch(err => {
        if (err && err.status === 401) {
          navigate("/login");
        }
      });
    fetchExpenseByIdAndSetFields();
    console.log('Data: ' + dayjs(new Date()).format('YYYY-MM-DD'))
  }, []);

  const fetchExpenseByIdAndSetFields = () => {

    if (expenseIdentifier) {
      getExpenseById(expenseIdentifier)
        .then(response => {
          setDescription(response.description);
          setAmount(response.amount.toString());
          setIsFixed(response.fixedExpense);
          setSelectedCategoryId(response.expenseCategory.id)
          setPurchaseDate(dayjs(response.datPurchase).format('YYYY-MM-DD'));
        });
    }
  }

  const currencyMask = createNumberMask({
    ...defaultMaskOptions
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (description && description.length > 0) 
    console.log(description)
    console.log(expenseId)
    console.log(amount)
    console.log(purchaseDate)
    console.log(isFixed)
    if (!expenseIdentifier) {
      createUserExpenses(
        {
          description,
          amount: amount.replace('.', '').replace(',', '.'),
          datPurchase: purchaseDate,
          fixedExpense: isFixed,
          expenseCategory: selectedCategoryId
        }
      ).then(response => {
        console.log(response)
        closeExpenseFormModal(true);
      }).catch(err => {
        if (err && err.status === 401) {
          navigate("/login");
        }
      });
    } else {
      updateExpense(
        {
          expenseId: expenseIdentifier,
          description,
          amount: amount.replace('.', '').replace(',', '.'),
          datPurchase: purchaseDate,
          fixedExpense: isFixed,
          expenseCategory: selectedCategoryId
        }
      ).then(response => {
        console.log(response)
        closeExpenseFormModal(true);
      }).catch(err => {
        if (err && err.status === 401) {
          navigate("/login");
        }
      });
    }
  }


  return (
    <Box sx={style}>
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)'
        }}
        textAlign='center'
      >
        Despesa
      </Typography>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <Box
          maxWidth
          pb={2}
        >
          <TextField
            id="group-name-field"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Descrição da despesa"
            variant="standard"
            size='small'
            InputLabelProps={{ shrink: description }}
          />
        </Box>
        <Grid
          container
          spacing={2}
          pb={2}
        >
          <Grid
            item
            xs={6}
          >
            <MaskedInput
              id="masked-input-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value.substring(2))}
              mask={currencyMask}
              inputMode='numeric'
              InputLabelProps={{ shrink: amount }}
              render={(innerRef, props) => (
                <TextField
                  {...props}
                  inputRef={innerRef}
                  id="amount-name-field"
                  fullWidth
                  label="Valor"
                  variant="standard"
                  size='small'
                />
              )} />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', alignSelf: 'flex-end' }}
          >
            <TextField
              id="group-name-field"
              variant="standard"
              size='small'
              type='date'
              defaultChecked
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          pt={0}
        >
          <Grid
            item
            xs={6}
          >
            <FormControl variant="standard" sx={{ m: 1, minWidth: 130, margin: 0, padding: 0 }}>
              <InputLabel id="demo-simple-select-standard-label">Categoria</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                label="Categoria"
              >
                <MenuItem value={999999}>
                  <em>Selecionar</em>
                </MenuItem>
                {expenseCategories.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', justifyItems: 'end', padding: 0 }}
          >
            <FormControlLabel control={<Switch checked={isFixed} onChange={(e) => setIsFixed(e.target.checked)} />} label="Despesa Fixa" />
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant='contained'
            type='submit'
          >
            Salvar
          </Button>
          <Button onClick={closeExpenseFormModal} color='error' variant='contained' sx={{ marginLeft: '1rem' }}>
            Fechar
          </Button>
        </Box>
      </form>
    </Box>

  );
}
export default ExpenseForm;
