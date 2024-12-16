import { AxiosResponse } from "axios";
import { axios_client } from "..";
import { PageableResponse, ShareSheetResponse, SheetResponse } from "../responses";
import { CreateSheetRequest, RetrieveSheetByIdRequest, ShareSheetRequest, UpdateSheetRequest } from "../requests";

export const create_sheet = (request: CreateSheetRequest):
    Promise<AxiosResponse<SheetResponse>> =>
    axios_client.post<SheetResponse>(
        `/sheet`,
        JSON.stringify(request)
    );

export const update_sheet = (request: UpdateSheetRequest):
    Promise<AxiosResponse<SheetResponse>> =>
    axios_client.patch<SheetResponse>(
        `/sheet/${request.id}`,
        JSON.stringify(request)
    );

export const share_sheet = (request: ShareSheetRequest):
    Promise<AxiosResponse<ShareSheetResponse>> =>
    axios_client.post<ShareSheetResponse>(
        `/sheet/${request.sheetId}/share-link`,
    );

export const fetch_sheets = ():
    Promise<AxiosResponse<PageableResponse<SheetResponse>>> =>
    axios_client.get<PageableResponse<SheetResponse>>(
        `/sheet?page-number=${0}&page-size=${100}`,
    );

export const fetch_sheet_by_id = (request: RetrieveSheetByIdRequest):
    Promise<AxiosResponse<SheetResponse>> =>
    axios_client.get<SheetResponse>(
        `/sheet/${request.sheetId}`,
    );