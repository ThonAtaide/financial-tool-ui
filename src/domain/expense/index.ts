import { UserExpenseRequest, UserExpenseResponse } from "../../integration/fin-tool-api/expenses";
import { ExpenseTypeDomain } from "../expenseType";

export class ExpenseDomain {
    id?: number | null;
    sheetId: number;
    description: string;
    amount: string;
    isFixedExpense: boolean;
    datPurchase: string;
    expenseType: ExpenseTypeDomain;

    constructor(
        id: number | null,
        sheetId: number,
        description: string,
        amount: string,
        isFixedExpense: boolean = false,
        datPurchase: string,
        expenseType: ExpenseTypeDomain,
    ) {
        this.id = id;
        this.sheetId = sheetId;
        this.description = description;
        this.amount = amount;
        this.isFixedExpense = isFixedExpense;
        this.datPurchase = datPurchase;
        this.expenseType = expenseType;
    }

    static fromResponse(
        sheetId: number,
        userExpenseResponse: UserExpenseResponse
    ) {
        return new this(
            userExpenseResponse.id,
            sheetId,
            userExpenseResponse.description,
            userExpenseResponse.amount,
            userExpenseResponse.isFixedExpense,
            userExpenseResponse.datPurchase,
            ExpenseTypeDomain.fromResponse(userExpenseResponse.expenseType)
        );
    }

    toUserExpenseRequest(): UserExpenseRequest {
        return {
            id: this.id,
            description: this.description,
            amount: this.amount,
            isFixedExpense: this.isFixedExpense,
            datPurchase: this.datPurchase,
            expenseType: this.expenseType.id,
        }
    }
}

