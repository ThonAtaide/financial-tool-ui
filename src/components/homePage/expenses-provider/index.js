import React, { createContext, useState, useEffect, useContext } from 'react';
import { useApiRequestWithStateResult } from '../../hook/api-request-statefull';
import { fetchUserExpenses, fetchUserExpensesGroupedByCategory, fetchUserExpensesGroupedByFixedOrNot } from '../../../utils/backend-client/expenses';
import dayjs from 'dayjs';

const ExpensesContext = createContext({});

export const ExpensesProvider = ({ children }) => {
  const statementTablePageSize = 8;
  const [userStatementPageNumber, setUserStatementPageNumber] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExpensesMonth, setSelectedExpensesMonth] = useState(dayjs(new Date()));

  const {
    data: userExpensesStatementData,
    isLoading: isLoadinguserExpensesStatementData,
    statefullRequestApi: requestUserExpensesStatement
  } = useApiRequestWithStateResult({ initialValue: null, apiRequest: fetchUserExpenses });

  const {
    data: userExpensesSumByCategoryData,
    isLoading: isLoadingUserExpensesSumByCategoryData,
    statefullRequestApi: requestUserExpensesSumByCategory
  } = useApiRequestWithStateResult({ initialValue: null, apiRequest: fetchUserExpensesGroupedByCategory });

  const {
    data: userExpensesSumByFixedOrNot,
    isLoading: isLoadingUserExpensesSumByFixedOrNot,
    statefullRequestApi: requestUserExpensesSumByFixedOrNot
  } = useApiRequestWithStateResult({ initialValue: null, apiRequest: fetchUserExpensesGroupedByFixedOrNot });

  useEffect(() => {
    refreshPageData();
    setUserStatementPageNumber(0);
    setSelectedCategories([]);
  }, [selectedExpensesMonth]);

  useEffect(() => {
    loadUserExpensesStatementData();
  }, [selectedCategories]);

  useEffect(() => {
    loadUserExpensesStatementData();
  }, [userStatementPageNumber]);

  const updateSelectedExpensesMonth = (value) => {
    if (value !== selectedExpensesMonth) {
      setSelectedExpensesMonth(value);
    }
  }

  const updateSelectedCategories = (category) => {
    if (selectedCategories.map(item => item.id).includes(category.id)) {
      setSelectedCategories(selectedCategories.filter(item => item.id !== category.id))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
    updateUserStatementPageNumber(0);
  }

  const updateUserStatementPageNumber = (pageNumber) => {
    setUserStatementPageNumber(pageNumber);
  }

  const loadUserExpensesStatementData = () => {
    const until = selectedExpensesMonth.startOf('month').format('YYYY-MM-DD')
    const from = selectedExpensesMonth.endOf('month').format('YYYY-MM-DD');
    requestUserExpensesStatement({ page: userStatementPageNumber, pageSize: statementTablePageSize, from, until, selectedCategories })
      .catch(err => {});
  }

  const loadUserExpensesSumByCategoryData = () => {
    const from = selectedExpensesMonth.format('YYYY-MM')
    requestUserExpensesSumByCategory({ from })
      .catch(err => { });
  }

  const loadUserExpensesGroupedByFixedOrNot = () => {
    const from = selectedExpensesMonth.format('YYYY-MM')
    requestUserExpensesSumByFixedOrNot({ from })
      .catch(err => { });
  }

  const refreshPageData = () => {
    loadUserExpensesStatementData();
    loadUserExpensesSumByCategoryData();
    loadUserExpensesGroupedByFixedOrNot();
  }

  return (
    <ExpensesContext.Provider
      value={{
        selectedCategories,
        selectedExpensesMonth,
        updateSelectedExpensesMonth,
        updateSelectedCategories,
        userStatementPageNumber,
        updateUserStatementPageNumber,
        userExpensesStatementData,
        isLoadinguserExpensesStatementData,
        userExpensesSumByCategoryData,
        isLoadingUserExpensesSumByCategoryData,
        loadUserExpensesSumByCategoryData,
        userExpensesSumByFixedOrNot,
        isLoadingUserExpensesSumByFixedOrNot,
        loadUserExpensesGroupedByFixedOrNot,
        refreshPageData,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpensesContext);
