import dayjs from 'dayjs';
import React, { useState } from 'react';
import { ExpenseCategoryDomain, ExpenseTypeDomain } from '../../../../domain/expenseType';
import { retrieveExpenseCategoriesBy } from '../../../../integration/fin-tool-api/expenseCategories';
import { createUserExpense, updateExpense, getExpenseById } from '../../../../integration/fin-tool-api/expenses';
import { useApiRequestStatelessHook } from '../../../hook/api-request-simple';
import { ExpenseDomain } from '../../../../domain/expense';

export interface ExpenseFormDataParamsI {
    expenseId?: number | null,
    sheetId: number,
    closeForm: (refresh?: boolean) => void
}

interface TextFieldData<T> {
    value: T,
    helperText: string | null
}

const defaultExpenseType = new ExpenseTypeDomain(99999, 'Default', 999999)

export const UseExpenseFormAdapter = (expenseFormDataParams: ExpenseFormDataParamsI) => {

    const [descriptionField, setDescriptionField] = useState<TextFieldData<string>>({ value: '', helperText: null });
    const [amountField, setAmountField] = useState<TextFieldData<string>>({ value: '', helperText: null });
    const [selectedExpenseTypeField, setSelectedExpenseTypeField] = useState<TextFieldData<number>>({ value: defaultExpenseType.id, helperText: null });
    const [purchaseDateField, setPurchaseDateField] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
    const [isFixedField, setIsFixedField] = useState<boolean>(false);

    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryDomain[]>([]);
    

    const { executeStatelessRequest: createExpenseRequest } = useApiRequestStatelessHook({ apiRequest: createUserExpense })
    const { executeStatelessRequest: updateExpenseRequest } = useApiRequestStatelessHook({ apiRequest: updateExpense })
    const { executeStatelessRequest: fetchExpenseByIdRequest } = useApiRequestStatelessHook({ apiRequest: getExpenseById })
    const { executeStatelessRequest: fetchExpenseCategoriesRequest } = useApiRequestStatelessHook({ apiRequest: retrieveExpenseCategoriesBy })

    // const findExpenseType = (expenseTypeId: number): ExpenseTypeDomain =>  

    const expenseDescriptionIsValid = (): boolean => {
        if (!descriptionField || !descriptionField.value || descriptionField.value.length < 2) {
          setDescriptionField({ ...descriptionField, helperText: 'A Descrição deve conter ao menos 2 caracteres.' });
          return false;
        } else if (descriptionField && descriptionField.value && descriptionField.value.length > 50) {
          setDescriptionField({ ...descriptionField, helperText: 'A Descrição não deve exceder 50 caracteres.' })
          return false;
        }
        return true;
      }
    
      const amountIsValid = () => {
        if (!amountField || !amountField.value) {
          setAmountField({ ...amountField, helperText: 'É preciso informar um valor.' });
          return false;
        }
        return true;
      }
    
      const expenseTypeIsValid = () => {
        if (!selectedExpenseTypeField || !selectedExpenseTypeField.value || selectedExpenseTypeField.value === defaultExpenseType.id) {
          setSelectedExpenseTypeField({ ...selectedExpenseTypeField, helperText: 'É preciso selecionar uma categoria.' });
          return false;
        }
        return true;
      }

      const countDecimalDigits = (value: number) => {
        const value_as_string = value.toString();
        if (!value_as_string.includes(".")) return 0;
        return value_as_string.length - (value_as_string.indexOf(".") + 1);
      }
    
      const fetchExpenseById = () => {
    
        if (expenseFormDataParams.expenseId) {
          fetchExpenseByIdRequest({ expenseId: expenseFormDataParams.expenseId, sheetId: expenseFormDataParams.sheetId })
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
    
              setDescriptionField({ ...descriptionField, value: response.description });
              setAmountField({ value: value, helperText: null });
              setIsFixedField(response.isFixedExpense);
              setSelectedExpenseTypeField({ value: response.expenseType.id, helperText: null })
              setPurchaseDateField(dayjs(response.datPurchase).format('YYYY-MM-DD'));
            }).catch(err => { });
        }
      }
    
      const findExpenseType = (expenseTypeId: number): ExpenseTypeDomain | null => {
        const expenseTypes = new Map<number, ExpenseTypeDomain> (expenseCategories
        .flatMap(category => category.expenseTypes)
        .map(item => [item.id, item]));
        return expenseTypes.get(expenseTypeId) || null
      }
      
    
      const prepareAmountToSave = (value: string): number => {
        return value && parseFloat(value.replace('R$', '').replaceAll('.', "").replace(',', '.')) || 0;
      }
    
      const registerNewExpense = () => {
        createExpenseRequest(
          new ExpenseDomain(
            null,
            expenseFormDataParams.sheetId,
            descriptionField.value,
            prepareAmountToSave(amountField.value),
            isFixedField,
            new Date(purchaseDateField),
            findExpenseType(selectedExpenseTypeField.value)!!
          )
        ).then((res) => expenseFormDataParams.closeForm(true))
          .catch(err => console.log(err));
      }
    
      const updateExistedExpense = () => {
        updateExpenseRequest(
          new ExpenseDomain(
            expenseFormDataParams.expenseId!!,
            expenseFormDataParams.sheetId,
            descriptionField.value,
            prepareAmountToSave(amountField.value),
            isFixedField,
            new Date(purchaseDateField),
            findExpenseType(selectedExpenseTypeField.value)!!
          )
        ).then(response => {
          expenseFormDataParams.closeForm(true);
        }).catch(err => { });
      }
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!expenseDescriptionIsValid() || !amountIsValid() || !expenseTypeIsValid()) return;
    
        if (!expenseFormDataParams.expenseId) {
          registerNewExpense();
        } else {
          updateExistedExpense();
        }
      }

      const loadExpenseCategories = () => {
        fetchExpenseCategoriesRequest({ sheetId: expenseFormDataParams.sheetId, pageNumber: 0, pageSize: 2000 })
          .then(response => {
            const categories = (response && response.content
              && response.content.map(item => { return ExpenseCategoryDomain.fromResponse(item) })) || [];
            setExpenseCategories(categories);
          }).catch(err => console.log(err));
      }

      return {
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
        setExpenseCategories,
        fetchExpenseById,
        handleSubmit,
        loadExpenseCategories
       }
}