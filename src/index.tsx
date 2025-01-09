import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthDataProvider } from './components/auth-provider/';
import { GlobalLoadingProvider } from './components/loading/global-loading/provider';
import GlobalLoading from './components/loading/global-loading/component';
import Popup from './components/popup/component';
import { PopupProvider } from './components/popup/provider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SignPage, { SignViewEnum } from './components/sign';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DarkThemeProvider } from './components/theme-provider';
import SheetListPanel from './components/contentPages/listSheets';
import SelectedSheetPage, { SheetPanelEnum } from './components/contentPages/selectedSheetPanel';
import { ExpensesProvider } from './components/expenses-provider';
import 'dayjs/locale/en-gb';


const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignPage selectedView={SignViewEnum.SIGN_IN} />,
  },
  {
    path: "/sign-up",
    element: <SignPage selectedView={SignViewEnum.SIGN_UP} />,
  },
  {
    path: "/forgot-password",
    element: <SignPage selectedView={SignViewEnum.PASSWORD_RECOVERY} />,
  },
  {
    path: "/reset-password",
    element: <SignPage selectedView={SignViewEnum.PASSWORD_RESET} />,
  },
  {
    path: "/",
    element: <SheetListPanel />,
  },
  {
    path: "/sheets/:id",
    element: <ExpensesProvider children={<SelectedSheetPage sheetPane={SheetPanelEnum.STATEMENTS} />} />
  },
  {
    path: "/sheets/:id/graficos",
    element: <ExpensesProvider children={<SelectedSheetPage sheetPane={SheetPanelEnum.CHARTS} />} />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <DarkThemeProvider>
    <AuthDataProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
        <PopupProvider>
          <GlobalLoadingProvider>
            <Popup />
            <GlobalLoading />
            <RouterProvider
              future={{
                v7_startTransition: true,
              }}
              router={router}
            />
          </GlobalLoadingProvider>
        </PopupProvider>
      </LocalizationProvider>
    </AuthDataProvider>
  </DarkThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
