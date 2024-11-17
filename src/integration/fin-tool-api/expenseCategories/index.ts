import { AxiosResponse } from "axios";
import { axios_client } from "..";
import { ExpenseCategoryResponse, PageableResponse } from "../responses";

export const retrieveExpenseCategoriesBy = async (
    pageSize: number = 100,
    pageNumber: number = 0,
    sheetId: number
): Promise<AxiosResponse<PageableResponse<ExpenseCategoryResponse>>> =>
    await axios_client.get<PageableResponse<ExpenseCategoryResponse>>(
        `/sheet/${sheetId}/expense-category?
        page-number=${pageNumber}
        &page-size=${pageSize}`
    );

export const retrieveExpenseCategoriesById = async (
    sheetId: number,
    categoryId: number
): Promise<AxiosResponse<ExpenseCategoryResponse>> =>
    await axios_client.get<ExpenseCategoryResponse>(
        `/sheet/${sheetId}/expense-category/${categoryId}`
    );
