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

// export const createUserExpenses = ({ description, amount, fixedExpense, datPurchase, expenseCategory, unnathorized_redirect }) => {
//     return axios_client.post(
//         `/${EXPENSES_RESOURCE}`,
//         JSON.stringify({ description, amount, fixedExpense, datPurchase, expenseCategory })
//     ).then(res => res.data)
//         .catch(err => handle_axios_response_error(err, unnathorized_redirect));
// }

export const fetchUserExpenses = async ({ page = 0, pageSize = 15, from, until }) => {
    
    return await axios_client.get(
        `/${EXPENSES_RESOURCE}?from=${from}&until=${until}`,
        {
            headers: {
                "page": page,
                "pageSize": pageSize
            },
            data: {}
        }
    );
}

// export const fetchUserExpenses = ({ page = 0, pageSize = 15, from, until, unnathorized_redirect }) => {
//     return axios_client.get(
//         `/${EXPENSES_RESOURCE}?from=${from}&until=${until}`,
//         {
//             headers: {
//                 "page": page,
//                 "pageSize": pageSize
//             },
//             data: {}
//         }
//     ).then(res => res.data)
//         .catch(err => handle_axios_response_error(err, unnathorized_redirect));
// }

export const fetchUserExpensesGroupedByCategory = async ({ from }) => {
    return await axios_client.get(
        `/${EXPENSES_RESOURCE}/grouped-by-categories?monthRange=${from}`,
        { data: {} }
    );
}

// export const fetchUserExpensesGroupedByCategory = ({ from, unnathorized_redirect }) => {
//     return axios_client.get(
//         `/${EXPENSES_RESOURCE}/grouped-by-categories?monthRange=${from}`,
//         { data: {} }
//     ).then(res => res.data)
//         .catch(err => handle_axios_response_error(err, unnathorized_redirect));
// }

export const fetchUserExpensesGroupedByFixedOrNot = async ({ from }) => {
    return await axios_client.get(
        `/${EXPENSES_RESOURCE}/grouped-by-is-fixed?monthRange=${from}`,
        { data: {} }

    );
}

// export const fetchUserExpensesGroupedByFixedOrNot = ({ from, unnathorized_redirect }) => {
//     return axios_client.get(
//         `/${EXPENSES_RESOURCE}/grouped-by-is-fixed?monthRange=${from}`,
//         { data: {} }

//     ).then(res => res.data)
//         .catch(err => handle_axios_response_error(err, unnathorized_redirect));
// }

export const deleteExpense = async (expenseId) => {
    return await axios_client.delete(`/${EXPENSES_RESOURCE}/${expenseId}`, { data: {} });
}

export const updateExpense = async ({ expenseId, description, amount, fixedExpense, datPurchase, expenseCategory }) => {
    return await axios_client.put(`/${EXPENSES_RESOURCE}/${expenseId}`,
        JSON.stringify({ id: expenseId, description, amount, fixedExpense, datPurchase, expenseCategory })
    )
}

// export const updateExpense = ({ expenseId, description, amount, fixedExpense, datPurchase, expenseCategory, unnathorized_redirect }) => {
//     return axios_client.put(`/${EXPENSES_RESOURCE}/${expenseId}`,
//         JSON.stringify({ id: expenseId, description, amount, fixedExpense, datPurchase, expenseCategory })
//     ).then(res => res.data)
//         .catch(err => handle_axios_response_error(err, unnathorized_redirect));
// }

export const getExpenseById = async ({ expenseId, unnathorized_redirect }) => {
    return await axios_client
    .get(`/${EXPENSES_RESOURCE}/${expenseId}`, { data: {} })        
}

// export const getExpenseById = ({ expenseId, unnathorized_redirect }) => {
//     return axios_client.get(`/${EXPENSES_RESOURCE}/${expenseId}`, { data: {} })
//         .then(res => res.data)
//         .catch(err => handle_axios_response_error(err, unnathorized_redirect));
// }