import { AxiosResponse } from "axios";
import { axios_client } from "..";
import { ExpenseCategoryResponse, ExpenseTypeResponse, PageableResponse } from "../responses";

export interface RetrieveExpenseCategoriesParams {
    pageSize: number,
    pageNumber: number,
    sheetId: number
}

export const retrieveExpenseCategoriesBy = (
    params: RetrieveExpenseCategoriesParams
): Promise<AxiosResponse<PageableResponse<ExpenseCategoryResponse>>> =>
    axios_client.get<PageableResponse<ExpenseCategoryResponse>>(
        `/sheet/${params.sheetId}/expense-category?
        page-number=${params.pageNumber}
        &page-size=${params.pageSize}`
    );

export const retrieveExpenseCategoriesById = (
    sheetId: number,
    categoryId: number
): Promise<AxiosResponse<ExpenseCategoryResponse>> =>
    axios_client.get<ExpenseCategoryResponse>(
        `/sheet/${sheetId}/expense-category/${categoryId}`
    );

export const fetchExpenseTypeById = ({ sheetId, expenseTypeId }: { sheetId: number, expenseTypeId: number })
    : Promise<AxiosResponse<ExpenseTypeResponse>> =>
    axios_client.get<ExpenseTypeResponse>(
        `/sheet/${sheetId}/expenseType/${expenseTypeId}`,
        {}
    );

export const createExpenseType = ({ name, sheetId, categoryId }: { name: string, sheetId: number, categoryId: number })
    : Promise<AxiosResponse<ExpenseTypeResponse>> =>
    axios_client.post<ExpenseTypeResponse>(
        `/sheet/${sheetId}/expenseType`,
        JSON.stringify({ name, categoryId })
    );

export const updateExpenseType = ({ name, sheetId, categoryId, expenseTypeId }: { name: string, sheetId: number, categoryId: number, expenseTypeId: number })
    : Promise<AxiosResponse<ExpenseTypeResponse>> =>
    axios_client.put<ExpenseTypeResponse>(
        `/sheet/${sheetId}/expenseType/${expenseTypeId}`,
        JSON.stringify({ name, categoryId })
    );

export const deleteExpenseType = ({ sheetId, expenseTypeId }: { sheetId: number, expenseTypeId: number })
    : Promise<AxiosResponse<void>> =>
    axios_client.delete<void>(
        `/sheet/${sheetId}/expenseType/${expenseTypeId}`,
        {}
    );