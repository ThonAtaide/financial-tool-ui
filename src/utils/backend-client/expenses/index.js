import { axios_client } from "..";

const EXPENSES_RESOURCE = "expenses";

export const createUserExpense = async ({ description, amount, isFixedExpense, datPurchase, expenseType }) => {
    return await axios_client.post(
        `/${EXPENSES_RESOURCE}`,
        JSON.stringify({ description, amount, isFixedExpense, datPurchase, expenseType })
    )
}

export const fetchUserExpenses = async ({ page = 0, pageSize = 15, from, until, selectedCategories = [] }) => {
    const categories = (selectedCategories && selectedCategories.length > 0 && selectedCategories.map(item => item.id).toString()) || []
    
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

export const updateExpense = async ({ expenseId, description, amount, isFixedExpense, datPurchase, expenseType }) => {
    return await axios_client.put(`/${EXPENSES_RESOURCE}/${expenseId}`,
        JSON.stringify({ id: expenseId, description, amount, isFixedExpense, datPurchase, expenseType })
    )
}

export const getExpenseById = async ({ expenseId }) => {
    return await axios_client
    .get(`/${EXPENSES_RESOURCE}/${expenseId}`, { data: {} })        
}
