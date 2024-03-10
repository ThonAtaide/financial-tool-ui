const PROD_PROPERTIES = {
    BACKEND_URL: process.env.BACKEND_URL
}

const DEV_PROPERTIES = {
    BACKEND_URL: 'https://164.68.122.5:443'
}

export const config = process.env.NODE_ENV === 'development' ? DEV_PROPERTIES : PROD_PROPERTIES;