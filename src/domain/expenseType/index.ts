import { ExpenseCategoryResponse, ExpenseTypeResponse } from "../../integration/fin-tool-api/responses";

export class ExpenseCategoryDomain {
    id: number;
    name: string;
    expenseTypes: ExpenseTypeDomain[]

    constructor(
        id: number,
        name: string,
        expenseTypes: ExpenseTypeResponse[]
    ) {
        this.id = id;
        this.name = name;
        this.expenseTypes = expenseTypes.map(item => ExpenseTypeDomain.fromResponse(item));
    }

    static fromResponse = (expenseCategoryResponse: ExpenseCategoryResponse) => {
        return new this(
            expenseCategoryResponse.id,
            expenseCategoryResponse.name,
            expenseCategoryResponse.expenseTypes
        )
    }
}

export class ExpenseTypeDomain {
    id: number;
    name: string;
    categoryId: number;
    isEditable: boolean;

    constructor(
        id: number,
        name: string,
        categoryId: number,
        isEditable: boolean,
    ) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.isEditable = isEditable;
    }

    static fromResponse(
        expenseTypeResponse: ExpenseTypeResponse
    ) {
        return new this(
            expenseTypeResponse.id,
            expenseTypeResponse.name,
            expenseTypeResponse.categoryId,
            expenseTypeResponse.isManagedByCustomer,
        );
    }

}