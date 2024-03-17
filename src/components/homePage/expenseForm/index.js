import { React, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, InputLabel, MenuItem, Select, TextField, Typography, FormControl, FormControlLabel, Switch, Grid, FormHelperText, Backdrop, CircularProgress } from '@mui/material';
import { createUserExpense, getExpenseById, updateExpense } from '../../../utils/backend-client/expenses';
import {fetchExpenseCategories}  from '../../../utils/backend-client/expenseCategories';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import dayjs from 'dayjs';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';
import { useApiRequestSimple } from '../../hook/api-request-simple';
import { useGlobalLoading } from '../../loading/global-loading/provider';

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
  integerLimit: 17, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false
}

const ExpenseForm = ({ closeExpenseFormModal, expenseIdentifier }) => {

  const [expenseCategories, setExpenseCategories] = useState([]);
  
  const [description, setDescription] = useState({value: '', helperText: null});
  const [amount, setAmount] = useState({value: '', helperText: null});
  const [selectedCategoryId, setSelectedCategoryId] = useState({value: 999999, helperText: null});
  const [purchaseDate, setPurchaseDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [isFixed, setIsFixed] = useState(false);
  
  const { isLoading: isLoadingCreateExpense, statelessRequestApi: createExpenseRequest } = useApiRequestSimple({apiRequest: createUserExpense})
  const { isLoading: isLoadingUpdateExpense, statelessRequestApi: updateExpenseRequest } = useApiRequestSimple({apiRequest: updateExpense})
  const { isLoading: isLoadingExpenseById, statelessRequestApi: fetchExpenseByIdRequest } = useApiRequestSimple({apiRequest: getExpenseById})
  const { isLoading: isLoadingExpenseCategories, statelessRequestApi: fetchExpenseCategoriesRequest } = useApiRequestSimple({apiRequest: fetchExpenseCategories})
    

  const validateDescription = () => {    
    if (!description || !description.value ||description.value.length < 2) {
      setDescription({...description, helperText: 'A Descrição deve conter ao menos 2 caracteres.'});
      return false;
    } else if(description && description.value && description.value.length > 50) {
      setDescription({...description, helperText: 'A Descrição não deve exceder 50 caracteres.'})
      return false;
    }
    return true;
  }

  const validateAmount = () => {    
    if (!amount || !amount.value) {
      setAmount({...amount, helperText: 'É preciso informar um valor.'});
      return false;
    } 
    return true;
  }

  const validateSelectedCategory = () => {    
    if (!selectedCategoryId || !selectedCategoryId.value || selectedCategoryId.value === 999999) {
      setSelectedCategoryId({...selectedCategoryId, helperText: 'É preciso selecionar uma categoria.'});
      return false;
    } 
    return true;
  }

  useEffect(() => {
    loadExpenseCategories();
    fetchExpenseByIdAndSetFields();
  }, []);

  const loadExpenseCategories = () => {
    fetchExpenseCategoriesRequest({})
    .then(response => {
      const categories = (response && response._embedded
        && response._embedded.expenseCategories.map(item => { return { id: item.id, name: item.name } })) || [];
      setExpenseCategories(categories);
    }).catch(err => {});
  }

  const countDecimalDigits = (value) => {
    const value_as_string = value.toString();
    if (!value_as_string.includes(".")) return 0;
    return value_as_string.length - (value_as_string.indexOf(".") + 1); 
  }

  const fetchExpenseByIdAndSetFields = () => {

    if (expenseIdentifier) {
      fetchExpenseByIdRequest({expenseId: expenseIdentifier})
        .then(response => {
          const decimalDigitsCount = countDecimalDigits(response.amount);
          let value;
          if (decimalDigitsCount === 0) {
            console.log(1);
            value = response.amount.toString().concat(",00")
          } else if (decimalDigitsCount === 1) {
            console.log(2);
            value = response.amount.toString().replace(".", ",").concat("0")
          } else {
            console.log(3);
            value = response.amount.toString().replace(".", ",")
          }
          
          setDescription({...description, value: response.description});
          setAmount({value: value, helperText: null});
          setIsFixed(response.fixedExpense);
          setSelectedCategoryId({value: response.expenseCategory.id, helperText: null})
          setPurchaseDate(dayjs(response.datPurchase).format('YYYY-MM-DD'));
        }).catch(err => {});
    }
  }

  const currencyMask = createNumberMask({
    ...defaultMaskOptions
  })

  const prepareAmountToSave = (value) => {
    return value && value.replace('R$', '').replaceAll('.', "").replace(',', '.') || "00.00";
  }

  const registerNewExpense = () => {
    createExpenseRequest(
          {
            description: description.value,
            amount: prepareAmountToSave(amount.value),
            datPurchase: purchaseDate,
            fixedExpense: isFixed,
            expenseCategory: selectedCategoryId.value
          }
        ).then((res) => closeExpenseFormModal(true))
        .catch(err => {});
  }

  const updateExistedExpense = () => {
    updateExpenseRequest(
          {
            expenseId: expenseIdentifier,
            description: description.value,
            amount: prepareAmountToSave(amount.value),
            datPurchase: purchaseDate,
            fixedExpense: isFixed,
            expenseCategory: selectedCategoryId.value
          }
        ).then(response => {
          closeExpenseFormModal(true);
        }).catch(err => {});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validateDescription() || !validateAmount() || !validateSelectedCategory()) return;
    
    if (!expenseIdentifier) {
      registerNewExpense();
    } else {
      updateExistedExpense();
    }
  }


  return (
    <Box sx={style}>
      <Box sx={{ display: 'flex' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoadingCreateExpense || isLoadingUpdateExpense || isLoadingExpenseById || isLoadingExpenseCategories}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </Box>
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
            value={description.value}
            onChange={(e) => setDescription({value: e.target.value, helperText: null})}
            helperText={description.helperText}
            label="Descrição da despesa"
            variant="standard"
            size='small'
            InputLabelProps={{ shrink: description.value && description.value !== ''? true:false }}
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
              value={amount.value}
              onChange={(e) => setAmount({value: e.target.value.substring(2), helperText: null})}
              mask={currencyMask}
              inputMode='numeric'
              InputLabelProps={{ shrink: amount.value && amount.value !== ''? true:false }}
              render={(innerRef, props) => (
                <TextField
                  {...props}
                  inputRef={innerRef}
                  id="amount-name-field"
                  fullWidth
                  label="Valor"
                  helperText={amount.helperText}
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
                value={selectedCategoryId.value}                
                onChange={(e) => setSelectedCategoryId({value: e.target.value, helperText: null})}
                label="Categoria"
              >
                <MenuItem value={999999}>
                  <em>Selecionar</em>
                </MenuItem>
                {expenseCategories.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
              </Select>
              {selectedCategoryId.helperText && <FormHelperText>{selectedCategoryId.helperText}</FormHelperText>}
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
