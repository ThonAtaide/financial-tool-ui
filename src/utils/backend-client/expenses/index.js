import { BACKEND_HOST, hookCheckAuthentication } from "..";

const EXPENSES_RESOURCE = "expenses";

export const createUserExpenses = async ({ description, amount, fixedExpense, datPurchase, expenseCategory }) => {
    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/${EXPENSES_RESOURCE}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include',
        body: JSON.stringify({ description, amount, fixedExpense, datPurchase, expenseCategory })
    }), 201).then(response => {
        console.log('response')
        console.log(response)
        return response.json()
    })
}

export const fetchUserExpenses = async ({ page = 0, pageSize = 15, from, until }) => {
    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/${EXPENSES_RESOURCE}?from=${from}&until=${until}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'page': page,
            'pageSize': pageSize
        },
        withCredntials: true,
        credentials: 'include'
    })).then(response => response.json())
}

export const fetchUserExpensesGroupedByCategory = async ({ from }) => {

    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/${EXPENSES_RESOURCE}/grouped-by-categories?monthRange=${from}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include'
    })).then(response => response.json())
}

export const fetchUserExpensesGroupedByFixedOrNot = async ({ from }) => {

    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/${EXPENSES_RESOURCE}/grouped-by-is-fixed?monthRange=${from}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include'
    })).then(response => response.json())
}

export const deleteExpense = async (expenseId) => {
    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include'
    }), 204);
}

export const updateExpense = ({ expenseId, description, amount, fixedExpense, datPurchase, expenseCategory }) => {
    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/expenses/${expenseId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include',
        body: JSON.stringify({id: expenseId, description, amount, fixedExpense, datPurchase, expenseCategory})
    })).then(response => response.json());
}

export const getExpenseById = (expenseId) => {
    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/expenses/${expenseId}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include',
    })).then(response => response.json());
}