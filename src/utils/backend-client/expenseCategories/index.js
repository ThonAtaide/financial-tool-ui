import { hookCheckAuthentication } from "..";
import { config } from '../../properties';
const { BACKEND_URL } = config;
const EXPENSES_CATEGORIES_RESOURCE = "expenseCategories";

export const fetchExpenseCategories = async ({ pageSize = 100, unnathorized_redirect }) => {
    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/${EXPENSES_CATEGORIES_RESOURCE}?size=${pageSize}`, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }),
        expected_status: 200,
        unnathorized_redirect
    });
}