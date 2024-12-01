import { AxiosResponse } from "axios";
import { axios_client } from "..";
import { PageableResponse, SheetResponse } from "../responses";



export const fetch_sheets = async ():
    Promise<AxiosResponse<PageableResponse<SheetResponse>>> =>
    axios_client.get<PageableResponse<SheetResponse>>(
        `/sheet?page-number=${0}&page-size=${100}`,
    );