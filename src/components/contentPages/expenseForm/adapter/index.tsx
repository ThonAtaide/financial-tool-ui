import dayjs from 'dayjs';
import React, { useState } from 'react';
import { ExpenseCategoryDomain, ExpenseTypeDomain } from '../../../../domain/expenseType';
import { deleteExpenseType, retrieveExpenseCategoriesBy } from '../../../../integration/fin-tool-api/expenseCategories';
import { createUserExpense, updateExpense, getExpenseById } from '../../../../integration/fin-tool-api/expenses';
import { useApiRequestStatelessHook } from '../../../hook/api-request-simple';
import { ExpenseDomain } from '../../../../domain/expense';
import { PopupProviderContextType, usePopup } from '../../../popup/provider';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
const tz = "America/Sao_Paulo";

export enum ExpenseFormActionEnum {
  CREATE,
  UPDATE
}

export interface ExpenseFormDataParamsI {
    expenseId?: number | null,
    sheetId: number,
    closeForm: (refresh?: boolean) => void,
    action: ExpenseFormActionEnum,
}

export interface TextFieldData<T> {
    value: T,
    helperText: string | null
}

interface ExpenseTypeFormData {
  isOpen: boolean,
  formData?: ExpenseTypeData | null
}
interface ExpenseTypeData {
  categoryId: number,
  expenseTypeId: number | null,
}

const defaultExpenseType = new ExpenseTypeDomain(99999, 'Default', 999999, false);

export const UseExpenseFormAdapter = (expenseFormDataParams: ExpenseFormDataParamsI) => {
    
    const [descriptionField, setDescriptionField] = useState<TextFieldData<string>>({ value: '', helperText: null });
    const [amountField, setAmountField] = useState<TextFieldData<string>>({ value: '0.00', helperText: null });
    const [selectedExpenseTypeField, setSelectedExpenseTypeField] = useState<TextFieldData<number>>({ value: defaultExpenseType.id, helperText: null });
    const [purchaseDateField, setPurchaseDateField] = useState<dayjs.Dayjs>(dayjs(new Date()).tz(tz));
    const [isFixedField, setIsFixedField] = useState<boolean>(false);
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryDomain[]>([]);    
    const [collapsedCategories, setCollapsedCategories] = useState<number[]>([]);
    const [expenseTypeFormData, setExpenseTypeFormData] = useState<ExpenseTypeFormData>({ isOpen: false });

    const { executeStatelessRequest: createExpenseRequest } = useApiRequestStatelessHook({ apiRequest: createUserExpense })
    const { executeStatelessRequest: updateExpenseRequest } = useApiRequestStatelessHook({ apiRequest: updateExpense })
    const { executeStatelessRequest: fetchExpenseByIdRequest } = useApiRequestStatelessHook({ apiRequest: getExpenseById })
    const { executeStatelessRequest: fetchExpenseCategoriesRequest } = useApiRequestStatelessHook({ apiRequest: retrieveExpenseCategoriesBy })
    const { executeStatelessRequest: remove } = useApiRequestStatelessHook({ apiRequest: deleteExpenseType });

    const { displaySuccessPopup } = usePopup() as PopupProviderContextType;

    const removeExpenseType = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
      expenseTypeId: number
    ) => {
        e.preventDefault();
        remove({ sheetId: expenseFormDataParams.sheetId, expenseTypeId })
          .then(() => {
            setSelectedExpenseTypeField({value: 99999, helperText: null})
            loadExpenseCategories();
          })
          .catch(err => console.log(err));      
    }
  
    const clickListSubHeader = (id: number) => {
      if (collapsedCategories.includes(id)) {
        setCollapsedCategories(collapsedCategories.filter(item => item !== id))
      } else {
        setCollapsedCategories([...collapsedCategories, id])
      }
    }
  
    

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
    
      const fetchExpenseById = () => {    
        if (expenseFormDataParams.action === ExpenseFormActionEnum.UPDATE && expenseFormDataParams.expenseId) {
          fetchExpenseByIdRequest({ expenseId: expenseFormDataParams.expenseId, sheetId: expenseFormDataParams.sheetId })
            .then(response => {
              setDescriptionField({ ...descriptionField, value: response.description });
              setAmountField({ value: response.amount, helperText: null });
              setIsFixedField(response.isFixedExpense);
              setSelectedExpenseTypeField({ value: response.expenseType.id, helperText: null })
              setPurchaseDateField(dayjs(response.datPurchase));
            }).catch(err => console.log(err));
        }
      }
    
      const findExpenseType = (expenseTypeId: number): ExpenseTypeDomain | null => {
        const expenseTypes = new Map<number, ExpenseTypeDomain> (expenseCategories
        .flatMap(category => category.expenseTypes)
        .map(item => [item.id, item]));
        return expenseTypes.get(expenseTypeId) || null
      }
          
      const registerNewExpense = () => {
        createExpenseRequest(
          new ExpenseDomain(
            null,
            expenseFormDataParams.sheetId,
            descriptionField.value,
            amountField.value,
            isFixedField,
            purchaseDateField.tz(tz).format('YYYY-MM-DD'),
            findExpenseType(selectedExpenseTypeField.value)!!
          )
        ).then((res) => {
          displaySuccessPopup('Despesa criada!', 'A despesa foi criada com sucesso.');
          expenseFormDataParams.closeForm(true)
        }).catch(err => console.log(err));
      }
    
      const updateExistedExpense = () => {
        updateExpenseRequest(
          new ExpenseDomain(
            expenseFormDataParams.expenseId!!,
            expenseFormDataParams.sheetId,
            descriptionField.value,
            amountField.value,
            isFixedField,
            purchaseDateField.tz(tz).format('YYYY-MM-DD'),
            findExpenseType(selectedExpenseTypeField.value)!!
          )
        ).then(response => {
          displaySuccessPopup('Despesa atualizada!', 'A despesa foi atualizada com sucesso.');
          expenseFormDataParams.closeForm(true);
        }).catch(err => { });
      }
    
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!expenseDescriptionIsValid() || !amountIsValid() || !expenseTypeIsValid()) return;  
        
        if (expenseFormDataParams.action === ExpenseFormActionEnum.UPDATE && expenseFormDataParams.expenseId) {
          updateExistedExpense();
        } else {
          registerNewExpense();
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
        loadExpenseCategories,
        collapsedCategories,
        setCollapsedCategories,
        expenseTypeFormData,
        setExpenseTypeFormData,
        clickListSubHeader,
        removeExpenseType,
       }
}