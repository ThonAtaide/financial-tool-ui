import React, { useEffect, useState } from 'react';
import { Box, Button, InputLabel, MenuItem, Select, TextField, Typography, FormControl, FormControlLabel, Switch, FormHelperText, Grid2, ListSubheader, Collapse, IconButton, Divider, Popover } from '@mui/material';
import { ExpenseDomain } from '../../../domain/expense';
import { NumericFormat } from 'react-number-format';
import { ExpenseFormDataParamsI, UseExpenseFormAdapter } from './adapter';
import { JSX } from 'react/jsx-runtime';
import { DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpenseTypeFormDialog from './expenseTypeForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { deleteExpenseType } from '../../../integration/fin-tool-api/expenseCategories';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '32em',
  maxWidth: '80%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.default',
  borderRadius: 2,
  p: 4
};

function NumberFormatCustom(props: { [x: string]: any; name?: any; inputRef?: any; onChange?: any; }) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      decimalSeparator='.'
      prefix='R$ '
      thousandSeparator
      decimalScale={2}
    />
  );
}

interface ExpenseTypeFormData {
  isOpen: boolean,
  formData?: ExpenseTypeData | null
}
interface ExpenseTypeData {
  categoryId: number,
  expenseTypeId: number | null,
}

const ExpenseForm = React.forwardRef<HTMLElement, ExpenseFormDataParamsI>((expenseFormDataParams, ref) => {

  const {
    descriptionField,
    setDescriptionField,
    amountField,
    setAmountField,
    selectedExpenseTypeField,
    setSelectedExpenseTypeField,
    purchaseDateField,
    setPurchaseDateField,
    isFixedField,
    setIsFixedField,
    expenseCategories,
    loadExpenseCategories,
    fetchExpenseById,
    handleSubmit,
  } = UseExpenseFormAdapter(expenseFormDataParams);

  const { executeStatelessRequest: remove } = useApiRequestStatelessHook({ apiRequest: deleteExpenseType });
  const [collapsedCategories, setCollapsedCategories] = useState<number[]>([]);
  const [expenseTypeFormData, setExpenseTypeFormData] = useState<ExpenseTypeFormData>({ isOpen: false });


  useEffect(() => {
    loadExpenseCategories();
    fetchExpenseById();
  }, []);

  const removeExpenseType = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, expenseTypeId: number) => {
      e.preventDefault();
      
      // startLoading();
      remove({ sheetId: expenseFormDataParams.sheetId, expenseTypeId })
        .then(() => {
          setSelectedExpenseTypeField({value: 99999, helperText: null})
          loadExpenseCategories();
        })
        .catch(err => console.log(err));
        // .finally(() => finishLoading());
    
  }

  const clickListSubHeader = (id: number) => {
    if (collapsedCategories.includes(id)) {
      setCollapsedCategories(collapsedCategories.filter(item => item !== id))
    } else {
      setCollapsedCategories([...collapsedCategories, id])
    }
  }

  const renderSubHeaderButton = (id: number) => {
    if (collapsedCategories.includes(id)) {
      return <RemoveIcon />
    }
    return <AddIcon />
  }

  const renderExpenseTypeOptions = () => {
    const options: JSX.Element[] = []
    expenseCategories.forEach(category => {
      options.push(
        <ListSubheader
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottomStyle: 'solid',
            borderBottomWidth: '0.5px',
            borderBottomColor: 'grey'
          }}
          key={`category-sub-header${category.id}`}
        >
          <Typography
            alignContent="center"
          >
            {category.name}
          </Typography>
          <IconButton onClick={() => clickListSubHeader(category.id)}>
            {renderSubHeaderButton(category.id)}
          </IconButton>
        </ListSubheader>)

      category.expenseTypes.forEach(expenseType => {
        if (collapsedCategories.includes(category.id)
          || selectedExpenseTypeField.value === expenseType.id
        ) {
          options.push(
            <MenuItem

              key={expenseType.id}
              value={expenseType.id}
              divider
            >
              <Typography
                variant='body1'
                sx={{ display: 'flex', width: '100%' }}
                alignItems="center"
                justifyContent="space-between"

              >
                {expenseType.name}
                {expenseType.isEditable &&
                  <Box>
                    <IconButton onClick={(e) => setExpenseTypeFormData({ isOpen: true, formData: { categoryId: category.id, expenseTypeId: expenseType.id } })}>
                      <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton onClick={(e) => removeExpenseType(e, expenseType.id)}>
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Box>

                }
              </Typography>

            </MenuItem>
          )
        }
      });
      if (collapsedCategories.includes(category.id)) {
        options.push(
          <>
            <MenuItem
              onClick={(e) => openExpenseTypeDialog(category.id, null)}
              style={{ padding: '6px 16px' }}
              key={`Criar sub-categoria ${category.name}`}
            >
              <Typography
                variant='body1'
                color='warning'
              >
                Criar Sub-Categoria
              </Typography>
            </MenuItem>
          </>
        )
      }
    })

    return options;
  }

  const openExpenseTypeDialog = (categoryId: number, expenseTypeId: number | null) => {
    setExpenseTypeFormData({ isOpen: true, formData: { categoryId, expenseTypeId } })
  }

  const handleExpenseTypeDialogClose = () => {
    setExpenseTypeFormData({ isOpen: false });
    loadExpenseCategories();
  }

  return (
    <Box 
      tabIndex={-1}
      ref={ref} 
      sx={style}
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography
        id="modal-modal-title"
        variant="h5"
        component="h2"
        sx={{
          fontFamily: 'var(--bs-font-sans-serif)',
          color: 'white',
          fontWeight: '500'
        }}
        textAlign='center'
      >
        Despesa
      </Typography>
        <Box
          pb={2}
        >
          <TextField
            color='info'
            id="group-name-field"
            fullWidth
            value={descriptionField.value}
            onChange={(e) => setDescriptionField({ value: e.target.value, helperText: null })}
            helperText={descriptionField.helperText}
            label="Descrição da despesa"
            variant="standard"
            size='small'
            slotProps={{ inputLabel: { shrink: descriptionField.value && descriptionField.value !== '' ? true : false } }}
          />
        </Box>
        <Grid2
          container
          spacing={2}
          pb={2}
        >
          <Grid2
            size={{ xs: 6 }}
          >
            <TextField
              id="amount-name-field"
              fullWidth
              value={amountField.value && parseFloat(amountField.value).toFixed(2) || 0.00}
              label="Valor"
              helperText={amountField.helperText}
              variant="standard"
              size='small'
              onChange={(e) => setAmountField({ value: e.target.value, helperText: null })}
              slotProps={{
                input: {
                  inputComponent: NumberFormatCustom
                }
              }}

            />
          </Grid2>
          <Grid2
            size={{ xs: 6 }}
            sx={{ display: 'flex', alignSelf: 'flex-end' }}
          >
            <DatePicker
              value={purchaseDateField}
              label="Data da despesa"
              format="DD/MM/YYYY"
              onChange={(e) => setPurchaseDateField(e!!)}
              slotProps={{
                textField: { size: 'small', variant: 'standard' },
                popper: {
                  sx: { zIndex: '10001' }
                },
              }}
            />
          </Grid2>
        </Grid2>
        <Grid2
          container
          spacing={2}
          pt={0}
        >
          <Grid2
            size={{ xs: 6 }}
          >
            <FormControl variant="standard" sx={{ m: 1, minWidth: 130, margin: 0, padding: 0 }}>
              <InputLabel id="demo-simple-select-standard-label">Categoria</InputLabel>
              <Select
                MenuProps={{
                  sx: { maxHeight: '30em' },
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                  },
                  transformOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                  }
                }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedExpenseTypeField.value}
                onClose={(e) => setCollapsedCategories([])}
                onChange={(e) => {
                  setSelectedExpenseTypeField({ value: e.target.value as number, helperText: null })
                }
                }
                label="Categoria"

              >
                <MenuItem value={99999}>
                  <em>Selecionar</em>
                </MenuItem>
                {renderExpenseTypeOptions()}
              </Select>
              {selectedExpenseTypeField.helperText
                && <FormHelperText>{selectedExpenseTypeField.helperText}</FormHelperText>
              }
            </FormControl>

          </Grid2>
          <Grid2
            size={{ xs: 6 }}
            sx={{ display: 'flex', justifyItems: 'end', padding: 0 }}
          >
            <FormControlLabel
              sx={{ color: 'white' }}
              control={<Switch
                checked={isFixedField}
                onChange={(e) => setIsFixedField(e.target.checked)}
              />} label="Despesa Fixa"
            />
          </Grid2>
        </Grid2>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant='contained'
            type='submit'
            color='info'
          >
            Salvar
          </Button>
          <Button
            onClick={() => expenseFormDataParams.closeForm(false)}
            color='info'
            variant='contained'
            sx={{ marginLeft: '1rem' }}>
            Fechar
          </Button>
        </Box>
      {expenseTypeFormData.formData && <ExpenseTypeFormDialog
        sheetId={expenseFormDataParams.sheetId}
        isOpen={expenseTypeFormData.isOpen}
        categoryId={expenseTypeFormData.formData.categoryId}
        subCategoryId={expenseTypeFormData.formData.expenseTypeId}
        handleClose={handleExpenseTypeDialogClose}
      />}
    </Box>

  );
})
export default ExpenseForm;
