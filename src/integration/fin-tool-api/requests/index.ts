export interface LoginRequest {
    email: string,
    password: string
}

export interface UserRegisterRequest {
    nickname: string,
    email: string,
    password: string
}

export interface ExpenseTypeRequest {
    id: number,
    categoryId: number,
}

export interface PasswordRecoveryRequest {
    email: string
}

export interface PasswordResetRequest {
    token: string,
    password: string,
}

export interface ShareSheetRequest {
    sheetId: number
}

export interface RetrieveSheetByIdRequest {
    sheetId: number
}

export interface CreateSheetRequest {
    name: string
}

export interface UpdateSheetRequest {
    id: number
    name: string
}