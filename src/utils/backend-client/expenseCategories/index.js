import { axios_client, handle_axios_response_error } from "..";
const EXPENSES_CATEGORIES_RESOURCE = "expenseCategories";

export const fetchExpenseCategories = async ({ pageSize = 100, unnathorized_redirect }) => {
    return axios_client.get(`/${EXPENSES_CATEGORIES_RESOURCE}?size=${pageSize}`)
        .then(res => res.data)
        .catch(err => handle_axios_response_error(err, unnathorized_redirect));
}