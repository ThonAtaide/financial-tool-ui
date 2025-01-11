const PROD_PROPERTIES: IConfiguration = {
    BACKEND_URL: 'https://kathon.click/api'
}

const DEV_PROPERTIES: IConfiguration = {
    BACKEND_URL: 'https://kathon.click/api'
}

export const config: IConfiguration = process.env.NODE_ENV === 'development' ? DEV_PROPERTIES : PROD_PROPERTIES;

interface IConfiguration {
    BACKEND_URL: string
}