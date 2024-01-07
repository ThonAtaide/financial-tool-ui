import { BACKEND_HOST, hookCheckAuthentication } from ".."
const EXPENSES_CATEGORIES_RESOURCE = "expenseCategories";

export const fetchExpenseCategories = async ({ pageSize = 100 }) => {
    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/${EXPENSES_CATEGORIES_RESOURCE}?size=${pageSize}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include'
    })).then(response => response.json())
}