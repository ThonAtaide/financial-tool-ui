import { hookCheckAuthentication } from "..";
import { config } from '../../properties';
const { BACKEND_URL } = config;

const EXPENSES_RESOURCE = "expenses";

export const createUserExpenses = async ({ description, amount, fixedExpense, datPurchase, expenseCategory, unnathorized_redirect }) => {
    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/${EXPENSES_RESOURCE}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredntials: true,
            credentials: 'include',
            body: JSON.stringify({ description, amount, fixedExpense, datPurchase, expenseCategory })
        }),
        expected_status: 201,
        unnathorized_redirect
    });
}

export const fetchUserExpenses = async ({ page = 0, pageSize = 15, from, until, unnathorized_redirect }) => {
    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/${EXPENSES_RESOURCE}?from=${from}&until=${until}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'page': page,
                'pageSize': pageSize
            },
            withCredntials: true,
            credentials: 'include',
        }),
        expected_status: 200,
        unnathorized_redirect
    });
}

export const fetchUserExpensesGroupedByCategory = async ({ from, unnathorized_redirect }) => {

    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/${EXPENSES_RESOURCE}/grouped-by-categories?monthRange=${from}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredntials: true,
            credentials: 'include'
        }),
        expected_status: 200,
        unnathorized_redirect
    });
}

export const fetchUserExpensesGroupedByFixedOrNot = async ({ from, unnathorized_redirect }) => {

    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/${EXPENSES_RESOURCE}/grouped-by-is-fixed?monthRange=${from}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredntials: true,
            credentials: 'include'
        }),
        expected_status: 200,
        unnathorized_redirect
    });
}

export const deleteExpense = async ({ expenseId, unnathorized_redirect }) => {
    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredntials: true,
            credentials: 'include'
        }),
        expected_status: 204,
        unnathorized_redirect
    });
}

export const updateExpense = ({ expenseId, description, amount, fixedExpense, datPurchase, expenseCategory, unnathorized_redirect }) => {
    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/expenses/${expenseId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredntials: true,
            credentials: 'include',
            body: JSON.stringify({ id: expenseId, description, amount, fixedExpense, datPurchase, expenseCategory })
        }),
        expected_status: 200,
        unnathorized_redirect
    });
}

export const getExpenseById = ({ expenseId, unnathorized_redirect }) => {
    return hookCheckAuthentication({
        request: () => fetch(`${BACKEND_URL}/expenses/${expenseId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredntials: true,
            credentials: 'include',
        }),
        expected_status: 200,
        unnathorized_redirect
    });
}