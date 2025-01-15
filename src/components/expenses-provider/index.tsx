import React, { createContext, useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { fetch_sheet_by_id } from '../../integration/fin-tool-api/sheets';
import { useApiRequestWithStateResult } from '../hook/api-request-statefull';
import { SheetResponse } from '../../integration/fin-tool-api/responses';
import { useApiRequestStatelessHook } from '../hook/api-request-simple';
import { fetchUserExpensesMonthAmountSum } from '../../integration/fin-tool-api/expenses';

export type UserExpensesDataCoxtextType = {
  selectedMonth: dayjs.Dayjs | null
  updateSelectedMonth: (selectedDateValue: dayjs.Dayjs | null) => void
  selectedSheet: SheetResponse | null | undefined
  getDateStartRange: () => string | null
  getDateEndRange: () => string | null
  expensesTotalAmount: number
  loadUserExpensesTotalAmount: () => void
  error: any
}

const ExpensesContext = createContext<UserExpensesDataCoxtextType | null>(null);

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { id } = useParams();

  const { executeStatelessRequest: retrieveSheetByIdRequest } = useApiRequestStatelessHook({ apiRequest: fetch_sheet_by_id })
  const { executeStatelessRequest: fetchExpensesTotalAmount } = useApiRequestStatelessHook({apiRequest: fetchUserExpensesMonthAmountSum})

  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(dayjs(new Date()));
  const [userExpensesAmountSum, setUserExpensesAmountSum] = useState<number>(0);
  const [sheetData, setSheetData] = useState<SheetResponse | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {    
    loadSheetData();
    loadUserExpensesTotalAmount();       
  }, []);

  const loadSheetData = () => {
    if (id) {
      retrieveSheetByIdRequest({sheetId: parseInt(id)})
      .then(res => setSheetData(res))
      .catch(err => setError(err));
    }  
  }

  useEffect(() => {
    if (id) {
      loadUserExpensesTotalAmount();
    }    
  }, [selectedMonth]);

  const loadUserExpensesTotalAmount = () => {
    if (id) {
      fetchExpensesTotalAmount({ sheetId: parseInt(id), from: selectedMonth!.format('YYYY-MM') })
      .then(res => setUserExpensesAmountSum(res.amount))
      .catch(err => console.log())
    }
  }

  const getDateStartRange = (): string | null => selectedMonth && selectedMonth.startOf('month').format('YYYY-MM-DD') || null

  const getDateEndRange = (): string | null => selectedMonth && selectedMonth.endOf('month').format('YYYY-MM-DD') || null

  const updateSelectedMonth = (selectedDateValue: dayjs.Dayjs | null) => {
    if (selectedDateValue !== selectedMonth) {
      setSelectedMonth(selectedDateValue);
    }
  }

  return (
    <ExpensesContext.Provider
      value={{
        selectedMonth,
        updateSelectedMonth,
        selectedSheet: sheetData,
        getDateStartRange,
        getDateEndRange,
        expensesTotalAmount: userExpensesAmountSum,
        loadUserExpensesTotalAmount,
        error,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpensesContext);
