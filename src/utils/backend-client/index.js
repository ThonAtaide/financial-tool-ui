const BACKEND_HOST = "http://localhost:8080";
const EXPENSES_RESOURCE = "expenses";
const EXPENSES_CATEGORIES_RESOURCE = "expenseCategories";

const hookCheckAuthentication = async (request, expectedStatus = 200) => {
    return request()
        .then(response => {
            if (response.status === 401) {
                localStorage.clear();
                throw response;
            } else if (response.status !== expectedStatus) {
                throw response;
            }
            return response
        })
}

export const login = (username, password) => {
    return fetch("http://localhost:8080/sign-in", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include',
        body: JSON.stringify({ username, password })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw response;
        }
    }).then(data => data.nickname);
};

export const logout = async () => {
    const response = await fetch("http://localhost:8080/sign-out", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include'
    });
    return {
        statusCode: response.status
    }
};

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

export const deleteExpense = (expenseId) => {
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