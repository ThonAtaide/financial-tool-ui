import React, { createContext, useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { fetch_sheet_by_id } from '../../integration/fin-tool-api/sheets';
import { useApiRequestWithStateResult } from '../hook/api-request-statefull';
import { SheetResponse } from '../../integration/fin-tool-api/responses';

export type UserExpensesDataCoxtextType = {
  selectedMonth: dayjs.Dayjs | null
  updateSelectedMonth: (selectedDateValue: dayjs.Dayjs | null) => void
  selectedSheet: SheetResponse | null | undefined
  getDateStartRange: () => string | null
  getDateEndRange: () => string | null
}

const ExpensesContext = createContext<UserExpensesDataCoxtextType | null>(null);

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { id } = useParams();

  const { data: sheetData, statefullRequestApi: retrieveSheetByIdRequest } = useApiRequestWithStateResult({initialValue: null, apiRequest: fetch_sheet_by_id })
  
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(dayjs(new Date()));

  useEffect(() => {
    if (id) {
      retrieveSheetByIdRequest({sheetId: parseInt(id)})
    }
    
  }, []);  

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
        getDateEndRange
      }}
    >
      {children}
    </ExpensesContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpensesContext);
