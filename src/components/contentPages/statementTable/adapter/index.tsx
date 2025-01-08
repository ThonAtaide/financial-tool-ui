import React, { useEffect, useState } from 'react';
import { deleteExpense, fetchUserExpenses, UserExpenseResponse } from '../../../../integration/fin-tool-api/expenses';
import { useApiRequestStatelessHook } from '../../../hook/api-request-simple';
import { useApiRequestWithStateResult } from '../../../hook/api-request-statefull';
import { useExpenses, UserExpensesDataCoxtextType } from '../../../expenses-provider';
import GlobalLoading from '../../../loading/global-loading/component';
import { GlobalLoadingContextType, GlobalLoadingProvider, useGlobalLoading } from '../../../loading/global-loading/provider';
import { PageableResponse } from '../../../../integration/fin-tool-api/responses';
import { ExpenseFormActionEnum } from '../../expenseForm/adapter';

export interface StatementTableParams {
    sheetId: number
}

// expensesData: PageableResponse<UserExpenseResponse> | null

const StatementTableAdapter = (params: StatementTableParams) => {    

    const {
        getDateEndRange,
        getDateStartRange,
        selectedMonth,
    } = useExpenses() as UserExpensesDataCoxtextType;

    const [isExpenseModalOpen, setExpenseModalOpen] = useState<boolean>(false);
    const [expenseFormAction, setExpenseFormAction] = useState<ExpenseFormActionEnum>(ExpenseFormActionEnum.CREATE);
    const [selectedExpense, setSelectedExpense] = useState<number | null>(null);
    const [expensesData, setExpensesData] = useState<PageableResponse<UserExpenseResponse> | null>(null);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [pageNumber, setPageNumber] = useState<number>(0);

    const { executeStatelessRequest: deleteExpenseRequest } = useApiRequestStatelessHook({ apiRequest: deleteExpense })
    const { executeStatelessRequest: retrieveExpenses } = useApiRequestStatelessHook({ apiRequest: fetchUserExpenses });
    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;

    useEffect(() => {
        if (selectedMonth)
            loadUserExpensesStatementData();
    }, [])

    useEffect(() => {
            loadUserExpensesStatementData();
    }, [selectedMonth, rowsPerPage, pageNumber])

    const createNewExpense = () => {
        setExpenseModalOpen(true);
        setExpenseFormAction(ExpenseFormActionEnum.CREATE);
    }

    const updateExpense = () => {
        setExpenseModalOpen(true);
        setExpenseFormAction(ExpenseFormActionEnum.UPDATE);
    }

    const updateRowsPerPage = (value: number) => {
        setRowsPerPage(value);
        setPageNumber(0);
    } 

    const closeExpenseGroupModal = (refresh: boolean = false) => {
        if (refresh) {
            loadUserExpensesStatementData()
            setSelectedExpense(null);
        }
        setExpenseModalOpen(false);
    }

    const removeExpense = () => {
        if (selectedExpense) {
            deleteExpenseRequest({
                sheetId: params.sheetId,
                expenseId: selectedExpense!!
            }).then(res => loadUserExpensesStatementData())
                .catch(err => console.log(err))
        }
    }

    const loadUserExpensesStatementData = () => {
        if (selectedMonth) {
            const from = getDateStartRange()!!;
            const until = getDateEndRange()!!;
            startLoading();
            retrieveExpenses({
                sheetId: params.sheetId,
                page: pageNumber,
                pageSize: rowsPerPage,
                from,
                until,
                selectedCategories: []
            })
            .then(res => setExpensesData(res))
            .catch(err => console.log(err))
            .finally(() => finishLoading())

        }
    }

    return {
        isExpenseModalOpen,
        setExpenseModalOpen,
        selectedExpense,
        setSelectedExpense,
        createNewExpense,
        updateExpense,
        closeExpenseGroupModal,
        removeExpense,
        expensesData,
        loadUserExpensesStatementData,
        rowsPerPage,
        updateRowsPerPage,
        pageNumber,
        setPageNumber,
        expenseFormAction,
    }
}

export const useStatementTableAdapter = (params: StatementTableParams) => StatementTableAdapter(params)