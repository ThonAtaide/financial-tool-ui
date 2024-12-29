import { AxiosResponse } from "axios";
import { axios_client } from "..";
import { ExpenseCategoryResponse, PageableResponse } from "../responses";

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
