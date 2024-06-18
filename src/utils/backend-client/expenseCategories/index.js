import { axios_client } from "..";
const EXPENSES_CATEGORIES_RESOURCE = "expenseCategory";

export const fetchExpenseCategories = async ({ pageSize = 100 }) => {
    return await axios_client.get(`/${EXPENSES_CATEGORIES_RESOURCE}?size=${pageSize}`);
}