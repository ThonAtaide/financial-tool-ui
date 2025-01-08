import { AxiosPromise, AxiosResponse } from "axios";
import { axios_client } from "..";
import { ExpenseTypeRequest } from "../requests";
import { ExpenseGroupedByCategoriesSummaryResponse, ExpenseGroupedByIsFixedOrNotResponse, ExpenseTypeResponse, PageableResponse, UserExpensesAmountSumResponse } from "../responses";
import { ExpenseDomain } from "../../../domain/expense";

export interface UserExpenseRequest {
    id?: number | null,
    description: string,
    amount: number,
    isFixedExpense: boolean,
    datPurchase: Date,
    expenseType: number,
}

export interface UserExpenseResponse {
    id: number,
    description: string,
    amount: number,
    isFixedExpense: boolean,
    datPurchase: Date,
    expenseType: ExpenseTypeResponse
}

export interface SheetIdAndExpenseIdPairI {
    sheetId: number,
    expenseId: number,
}

export const createUserExpense = (expenseDomain: ExpenseDomain)
    : Promise<AxiosResponse<UserExpenseResponse>> =>
    axios_client.post<UserExpenseResponse>(
        `/sheet/${expenseDomain.sheetId}/expense`,
        JSON.stringify(expenseDomain.toUserExpenseRequest())
    )

export const updateExpense = (expenseDomain: ExpenseDomain) => {
    return axios_client.put(`/sheet/${expenseDomain.sheetId}/expense/${expenseDomain.id}`,
        JSON.stringify(expenseDomain.toUserExpenseRequest())
    )
}

export const getExpenseById = (sheetIdAndExpenseIdPairI: SheetIdAndExpenseIdPairI): Promise<AxiosResponse<UserExpenseResponse>> => {
    return axios_client
        .get<UserExpenseResponse>(`/sheet/${sheetIdAndExpenseIdPairI.sheetId}/expense/${sheetIdAndExpenseIdPairI.expenseId}`, { data: {} })
}

export const deleteExpense = (sheetIdAndExpenseIdPairI: SheetIdAndExpenseIdPairI): Promise<AxiosResponse<void>> => {
    return axios_client.delete<void>(`/sheet/${sheetIdAndExpenseIdPairI.sheetId}/expense/${sheetIdAndExpenseIdPairI.expenseId}`, { data: {} });
}

export interface UserExpensesFetchRequest {
    sheetId: number,
    page: number,
    pageSize: number,
    from: string,
    until: string,
    selectedCategories: number[],
}

export interface UserExpensesGroupedByCategoryRequest {
    sheetId: number,
    from: string,
}

export interface UserExpensesGroupedByIsFixedOrNotRequest {
    sheetId: number,
    from: string,
}

export interface UserExpensesAmountSumRequest {
    sheetId: number,
    from: string,
}

export const fetchUserExpenses = (userExpensesFetch: UserExpensesFetchRequest)
    : Promise<AxiosResponse<PageableResponse<UserExpenseResponse>>> => {
    console.log()
    const {
        sheetId,
        page,
        pageSize,
        from,
        until,
        selectedCategories
    } = userExpensesFetch
    const categories = selectedCategories && selectedCategories.length > 0 && selectedCategories.map(item => item).toString() || []
    return axios_client.get<PageableResponse<UserExpenseResponse>>(
        `/sheet/${sheetId}/expense?from=${from}&until=${until}&categories=${categories}`,
        {
            headers: {
                "page": page,
                "pageSize": pageSize
            },
            data: {}
        }
    );
}

export const fetchUserExpensesGroupedByCategory = (request: UserExpensesGroupedByCategoryRequest)
: Promise<AxiosResponse<ExpenseGroupedByCategoriesSummaryResponse[]>> => {
    return axios_client.get<ExpenseGroupedByCategoriesSummaryResponse[]>(
        `/sheet/${request.sheetId}/expense/grouped-by-categories?monthRange=${request.from}`,
        { data: {} }
    );
}

export const fetchUserExpensesGroupedByFixedOrNot = (request: UserExpensesGroupedByIsFixedOrNotRequest)
: Promise<AxiosResponse<ExpenseGroupedByIsFixedOrNotResponse[]>> => {
    return axios_client.get<ExpenseGroupedByIsFixedOrNotResponse[]>(
        `/sheet/${request.sheetId}/expense/grouped-by-is-fixed?monthRange=${request.from}`,
        { data: {} }
    );
}

export const fetchUserExpensesMonthAmountSum = (request: UserExpensesAmountSumRequest)
: Promise<AxiosResponse<UserExpensesAmountSumResponse>> => {
    return axios_client.get<UserExpensesAmountSumResponse>(
        `/sheet/${request.sheetId}/expense/consolidated?monthRange=${request.from}`,
        { data: {} }
    );
}
