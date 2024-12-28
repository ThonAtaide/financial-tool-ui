import React, { createContext, useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { fetch_sheet_by_id } from '../../integration/fin-tool-api/sheets';
import { useApiRequestWithStateResult } from '../hook/api-request-statefull';
import { fetchUserExpenses, UserExpenseResponse } from '../../integration/fin-tool-api/expenses';
import { PageableResponse, SheetResponse } from '../../integration/fin-tool-api/responses';

export type UserExpensesDataCoxtextType = {
  selectedMonth: dayjs.Dayjs | null
  updateSelectedMonth: (selectedDateValue: dayjs.Dayjs | null) => void
  selectedSheet: SheetResponse | null | undefined
  expensesData: PageableResponse<UserExpenseResponse> | null
}

const ExpensesContext = createContext<UserExpensesDataCoxtextType | null>(null);

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { id } = useParams();

  const { data: sheetData, statefullRequestApi: retrieveSheetByIdRequest } = useApiRequestWithStateResult({initialValue: null, apiRequest: fetch_sheet_by_id })
  const { data: expensesData, statefullRequestApi: retrieveExpenses } = useApiRequestWithStateResult({initialValue: null, apiRequest: fetchUserExpenses});
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(dayjs(new Date()));

  useEffect(() => {
    if (id) {
      retrieveSheetByIdRequest({sheetId: parseInt(id)})
      loadUserExpensesStatementData()
    }
    
  }, []);

  const loadUserExpensesStatementData = () => {
    if (id && selectedMonth) {
      const from = selectedMonth.startOf('month').format('YYYY-MM-DD')
      const until = selectedMonth.endOf('month').format('YYYY-MM-DD');
      retrieveExpenses({ sheetId: parseInt(id), page: 0, pageSize: 10, from, until, selectedCategories: [] })        
    }    
  }

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
        expensesData
      }}
    >
      {children}
    </ExpensesContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpensesContext);
