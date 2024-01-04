const BACKEND_HOST = "http://localhost:8080";
const EXPENSES_RESOURCE = "expenses";

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

export const fetchUserExpenses = async ({page = 0, pageSize = 15, from, until}) => {    
    
    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/${EXPENSES_RESOURCE}?from=${from}&until=${until}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'page': page > 0? page - 1: page,
            'pageSize': pageSize
        },
        withCredntials: true,
        credentials: 'include'
    })).then(response => response.json())    
}

export const fetchUserExpensesGroupedByCategory = async ({from}) => {    
    
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
    return fetch(`${BACKEND_HOST}/expenses/${expenseId}`, {
        method: 'DELETE',
        withCredntials: true,
        credentials: 'include'
    }).then(response => {        
        if (response.status === 204) {
            return {};
        } 
        throw response;
    });
}

export const registerUserExpense = (expense) => {
    return fetch(`${BACKEND_HOST}/expenses`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include',
        body: JSON.stringify(expense)
    }).then(response => {        
        if (response.status === 201) {
            return response.json();
        } else {
            throw response;
        }
    });
}

export const updateExpense = ({expenseId, expense}) => {
    return fetch(`${BACKEND_HOST}/expenses/${expenseId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include',
        body: JSON.stringify(expense)
    }).then(response => {        
        if (response.status === 200) {
            return response.json();
        } else {
            throw response;
        }
    });
}

export const getExpenseGroupById = (expenseId) => {
    return hookCheckAuthentication(() => fetch(`${BACKEND_HOST}/expenses/${expenseId}`, {
        withCredntials: true,
        credentials: 'include',
    })).then(response => response.json());
}