import { axios_client, handle_axios_response_error, hookCheckAuthentication } from "..";
import { config } from '../../properties';
const { BACKEND_URL } = config;

const EXPENSES_RESOURCE = "expenses";

export const createUserExpense = async ({ description, amount, fixedExpense, datPurchase, expenseCategory }) => {
    return await axios_client.post(
        `/${EXPENSES_RESOURCE}`,
        JSON.stringify({ description, amount, fixedExpense, datPurchase, expenseCategory })
    )
}

export const fetchUserExpenses = async ({ page = 0, pageSize = 15, from, until, selectedCategories = [] }) => {
    const categories = selectedCategories && selectedCategories.length > 0 && selectedCategories.map(item => item.id).toString() || []
    
    return await axios_client.get(
        `/${EXPENSES_RESOURCE}?from=${from}&until=${until}&categories=${categories}`,
        {
            headers: {
                "page": page,
                "pageSize": pageSize
            },
            data: {}
        }
    );
}

export const fetchUserExpensesGroupedByCategory = async ({ from }) => {
    return await axios_client.get(
        `/${EXPENSES_RESOURCE}/grouped-by-categories?monthRange=${from}`,
        { data: {} }
    );
}

export const fetchUserExpensesGroupedByFixedOrNot = async ({ from }) => {
    return await axios_client.get(
        `/${EXPENSES_RESOURCE}/grouped-by-is-fixed?monthRange=${from}`,
        { data: {} }

    );
}

export const deleteExpense = async (expenseId) => {
    return await axios_client.delete(`/${EXPENSES_RESOURCE}/${expenseId}`, { data: {} });
}

export const updateExpense = async ({ expenseId, description, amount, fixedExpense, datPurchase, expenseCategory }) => {
    return await axios_client.put(`/${EXPENSES_RESOURCE}/${expenseId}`,
        JSON.stringify({ id: expenseId, description, amount, fixedExpense, datPurchase, expenseCategory })
    )
}

export const getExpenseById = async ({ expenseId, unnathorized_redirect }) => {
    return await axios_client
    .get(`/${EXPENSES_RESOURCE}/${expenseId}`, { data: {} })        
}
