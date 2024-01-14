const PROD_PROPERTIES = {
    BACKEND_URL: process.env.BACKEND_URL
}

const DEV_PROPERTIES = {
    BACKEND_URL: 'http://192.168.0.61:8080'
}

export const config = process.env.NODE_ENV === 'development' ? DEV_PROPERTIES : PROD_PROPERTIES;