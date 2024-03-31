const PROD_PROPERTIES = {
    BACKEND_URL: process.env.BACKEND_URL
}

const DEV_PROPERTIES = {
    BACKEND_URL: 'https://kathon.click/api'
}

export const config = process.env.NODE_ENV === 'development' ? DEV_PROPERTIES : PROD_PROPERTIES;