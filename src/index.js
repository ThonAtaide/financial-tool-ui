import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import LoginPage from './components/login'
import Home from './components/homePage'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './components/error';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PopupProvider } from './components/popup/provider';
import Popup from './components/popup/component';
import GlobalLoading from './components/loading/global-loading/component';
import { GlobalLoadingProvider } from './components/loading/global-loading/provider';
import { ExpensesProvider } from './components/homePage/expenses-provider';
import { AuthDataProvider } from './components/auth-provider';


const router = createBrowserRouter([
  {
    path: "/",
    element: <ExpensesProvider children={<Home />} />,
    errorElement: <ErrorPage />,
    // loader: userExpensesLoader
  },
  {
    path: "/login",
    element: <LoginPage showRegisterForm={false} />,
  },
  {
    path: "/register",
    element: <LoginPage showRegisterForm={true} />,
  },
  {
    path: "/error",
    element: <ErrorPage />
  },
  // {
  //   path: "/dashboard/:groupId",
  //   element: <DashboardPage />,
  //   errorElement: <ErrorPage/>,
  //   loader: expenseGroupLoader
  // }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthDataProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
      <PopupProvider>
        <GlobalLoadingProvider>
          <Popup />
          <GlobalLoading />
          <RouterProvider router={router} />
        </GlobalLoadingProvider>
      </PopupProvider>
    </LocalizationProvider>
  </AuthDataProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
