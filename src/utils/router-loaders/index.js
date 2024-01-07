import { fetchUserExpenses, getExpenseById } from "../backend-client";
import { redirect } from "react-router-dom";

export const userExpensesLoader = async ({ request }, args) => {
    console.log('args')
    console.log(request)
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get('page') || 0;
    const pageSize = searchParams.get('pageSize') || 10;
    
    try {
        const data = await fetchUserExpenses(page, pageSize);        
        return data;
    } catch (err) {        
        if (err.status === 401) {
            return redirect('/login');
        }
        throw err;
    }
}

export const userExpenseLoaderById = async ({params}) => {
    const { expenseId } = params;
    try {
        const data = await getExpenseById(expenseId);
        return data;
    } catch (err) {        
        if (err.status === 401) {
            return redirect('/login');
        }
        throw err;
    }
}