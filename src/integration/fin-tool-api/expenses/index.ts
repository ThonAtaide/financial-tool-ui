import { AxiosPromise, AxiosResponse } from "axios";
import { axios_client } from "..";
import { ExpenseTypeRequest } from "../requests";
import { ExpenseTypeResponse, PageableResponse } from "../responses";

export interface UserExpenseRequest {
    id?: number,
    description: string,
    amount: number,
    isFixedExpense: Boolean,
    datPurchase: Date,
    expenseType: number,
}

export interface UserExpenseResponse {
    id: number,
    description: string,
    amount: number,
    isFixedExpense: Boolean,
    datPurchase: Date,
    expenseType: ExpenseTypeResponse
}

export const createUserExpense = (sheetId: number, userExpenseRequest: UserExpenseRequest)
    : Promise<AxiosResponse<UserExpenseResponse>> =>
    axios_client.post<UserExpenseResponse>(
        `/sheet/${sheetId}/expense`,
        JSON.stringify(userExpenseRequest)
    )

export const updateExpense = (sheetId: number, expenseId: number, userExpenseRequest: UserExpenseRequest) => {
    return axios_client.put(`/sheet/${sheetId}/expense/${expenseId}`,
        JSON.stringify(userExpenseRequest)
    )
}

export const getExpenseById = (sheetId: number, expenseId: number): Promise<AxiosResponse<UserExpenseResponse>> => {
    return axios_client
        .get<UserExpenseResponse>(`/sheet/${sheetId}/expense/${expenseId}`, { data: {} })
}

export const deleteExpense = async (sheetId: number, expenseId: number): Promise<AxiosResponse<void>> => {
    return axios_client.delete<void>(`/sheet/${sheetId}/expense/${expenseId}`, { data: {} });
}

export interface UserExpensesFetchRequest {
    sheetId: number,
    page: number,
    pageSize: number,
    from: string,
    until: string,
    selectedCategories: number[],
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
    console.log('Buscando despesas')
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

// export const fetchUserExpensesGroupedByCategory = async ({ from }) => {
//     return await axios_client.get(
//         `/${EXPENSES_RESOURCE}/grouped-by-categories?monthRange=${from}`,
//         { data: {} }
//     );
// }

// export const fetchUserExpensesGroupedByFixedOrNot = async ({ from }) => {
//     return await axios_client.get(
//         `/${EXPENSES_RESOURCE}/grouped-by-is-fixed?monthRange=${from}`,
//         { data: {} }

//     );
// }


