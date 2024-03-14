import { axios_client, handle_axios_response_error } from "..";
const EXPENSES_CATEGORIES_RESOURCE = "expenseCategories";

export const fetchExpenseCategories = async ({ pageSize = 100 }) => {
    return await axios_client.get(`/${EXPENSES_CATEGORIES_RESOURCE}?size=${pageSize}`);
}