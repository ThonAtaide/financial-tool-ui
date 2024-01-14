import { config } from '../properties';
const { BACKEND_URL } = config;
const UNNAUTHORIZED_STATUS_CODE = 401;

export const axios_client = axios.create({
    baseURL: BACKEND_URL 
  });

const unexpectedError = () => { return { title: 'Houve um erro inesperado.', errors: ['Não foi possível atender a requisição. Por favor tente novamente.'] } };

const decodeResponse = async (response) => {
    const status = response.status;
    let body = {}
    try {
        const body_text = await response.text();
        if (body_text && body_text.length > 0) {
            body = JSON.parse(body_text);
        }
    } catch (err) {
        console.log(`Error to parse response ${err}`);
        body = unexpectedError();
    } finally {
        return { status, body }
    }
}

export const hookCheckAuthentication = async ({ request, expected_status = 200, unnathorized_redirect }) => {
    let extracted_response;
    try {
        const response = await request();
        extracted_response = await decodeResponse(response);        
    } catch (err) {
        console.log(err)
        throw {
            title: 'Servidor indisponível.',
            errors: ['Não foi possível acessar o servidor. Por favor tente mais tarde.']
        }
    } 
    if (extracted_response.status === UNNAUTHORIZED_STATUS_CODE) {
        console.log(extracted_response);
        localStorage.clear();
        if (unnathorized_redirect && unnathorized_redirect instanceof Function) {                
            unnathorized_redirect();                
        }
        throw extracted_response.body;
    } else if (extracted_response.status !== expected_status) {
        throw extracted_response.body;
    }
    return extracted_response.body;
    
}
