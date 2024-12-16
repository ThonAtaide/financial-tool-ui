export interface ErrorResponse {
    statusCode: number,
    errorType: string,
    title: string,
    errorMessage: string,
    instance: string,
    timestamp: string
}

export interface LoginResponse {
    nickname: string
}

export interface UserRegisterResponse {
    nickname: string
}

export interface UserRefreshResponse {
    nickname: string,
    email: string,
}

export interface RecoveryPasswordInfoResponse {
    nickname: string
}

export interface ExpenseTypeResponse {
    id: number,
    name: string
}

export interface ExpenseCategoryResponse {
    id: number,
    name: string,
    expenseTypes: ExpenseTypeResponse[]
}

export interface ExpenseResponse {
    id: number,
    description: string,
    isFixedExpense: Boolean,
    amount: string,
    datPurchase: Date,
    expenseType: ExpenseTypeResponse
}

export interface SheetMember {
    id: number,
    name: string,
}

export interface SheetResponse {
    id: number,
    name: string,
    createdBy: string,
    members: Array<SheetMember>,
    datCreation: Date,
    datUpdate: Date    
}

export interface ShareSheetResponse {
    link: string
}

export interface PageableResponse<T> {
    totalPages: number,
    totalElements: number,
    numberOfElements: number,
    size: number,
    content: T[]
    number: number,
    first: Boolean
    last: Boolean
    empty: Boolean
}
