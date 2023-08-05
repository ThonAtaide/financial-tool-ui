const BACKEND_HOST = "http://localhost:8080"

export const login = async (email, password) => {
    const response = await fetch("http://localhost:8080/auth/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredntials: true,
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });
    const body = await response.json();
    return {
        statusCode: response.status,
        data: body
    }
};

export const logout = async () => {
    const response = await fetch("http://localhost:8080/auth/logout", {
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

export const fetchUserExpenseGroups = async (page = 0, pageSize = 10) => {
    const response =  await fetch(`${BACKEND_HOST}/expense-group`, {
        withCredntials: true,
        credentials: 'include'
    })
    console.log(response);
    const body = await response.json();
    console.log(body);
    return {
        statusCode: response.status,
        data: body
    }
}
