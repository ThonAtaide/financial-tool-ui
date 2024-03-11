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


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <ErrorPage/>,
    // loader: userExpensesLoader
  },
  {
    path: "/login",
    element: <LoginPage showRegisterForm={false}/>,
  },
  {
    path: "/register",
    element: <LoginPage showRegisterForm={true}/>,
  },
  {
    path: "/error",
    element: <ErrorPage/>
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
      <PopupProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
        <Popup/> 
        <RouterProvider router={router} />
      
    </LocalizationProvider>
      </PopupProvider> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
