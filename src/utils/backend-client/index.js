export const BACKEND_HOST = "http://localhost:8080";


export const hookCheckAuthentication = async (request, expectedStatus = 200) => {
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



