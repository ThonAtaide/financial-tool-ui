export interface LoginRequest {
    email: string,
    password: string
}

export interface UserRegisterRequest {
    nickname: string,
    email: string,
    password: string
}

export interface ExpenseTypeResponse {
    id: number,
    name: string
}

export interface PasswordRecoveryRequest {
    email: string
}