import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Grid2, Typography, Fab, Modal, Backdrop, CircularProgress, Paper, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { ArrowDropDownIcon, DatePicker } from '@mui/x-date-pickers';
// import StatementTable from './statementTable';
// import CustomPieChart from './customPieChart';
// import UserBalancePane from './balance';
// import ExpenseForm from './expenseForm';
import 'dayjs/locale/pt-br';
import ResponsiveAppBar from '../../header';
import { useExpenses, UserExpensesDataCoxtextType } from '../../expenses-provider';
import FabButtonMenu from '../FabButtonMenu';
import StatementTable from '../statementTable';
import ExpenseForm from '../expenseForm';
import { ptBR } from '@mui/x-date-pickers/locales';
import ChartsPanel from '../chartsPanel';
import { formatBRLCurrency } from '../../../utils/currencyFormatter';
// import { useExpenses } from './expenses-provider';

export interface SelectedSheetPageParams {
    sheetPane: SheetPanelEnum
}

export enum SheetPanelEnum {
    STATEMENTS,
    CHARTS,
}

const SelectedSheetPage: React.FC<SelectedSheetPageParams> = (params: SelectedSheetPageParams) => {
    const {
        selectedMonth,
        updateSelectedMonth,
        selectedSheet: selectedSheetData,
        expensesTotalAmount
    } = useExpenses() as UserExpensesDataCoxtextType;   

    const renderStatementPage = () => {
        return selectedSheetData &&
            <StatementTable
                sheetId={selectedSheetData.id}
            />
    }

    const renderChartsPage = () => {
        return selectedSheetData &&
            <ChartsPanel />
    }

    const renderPane = () => {
        switch (params.sheetPane) {
            case SheetPanelEnum.STATEMENTS: return renderStatementPage();
            case SheetPanelEnum.CHARTS: return renderChartsPage();
        }
    }

    return (
        <Box >
            <ResponsiveAppBar selectedSheetId={selectedSheetData?.id} />
            <Box
                padding={4}
                sx={{
                    display: { xs: 'flex', md: 'flex', justifyContent: 'space-between' }
                }}
            >
                <Typography
                    variant='h4'
                    sx={{
                        fontFamily: 'var(--bs-font-sans-serif)',
                        fontWeight: '600',
                        color: "white"
                    }}
                >
                    Planilha: {selectedSheetData?.name}
                </Typography>
                <DatePicker
                    onAccept={(e) => updateSelectedMonth(e)}
                    value={dayjs(selectedMonth)}
                    views={['month', 'year']}
                    slots={{
                        openPickerIcon: ArrowDropDownIcon,
                    }}
                />
            </Box>
            <Box display="flex" justifyContent="flex-end" pr={4}>
                <Box>
                    <TextField
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                        value={`Total: ${formatBRLCurrency(expensesTotalAmount)}`}
                    />
                </Box>
            </Box>
            <Box
                display='flex'
                justifyContent='center'
                padding={4}
                sx={{ backgroundColor: 'transparent' }}
            >
                <Paper
                    square={false}
                    elevation={6}
                    sx={{
                        width: '100%',
                        marginBottom: '5em',
                        borderRadius: '0.3em',
                    }}
                >
                    {renderPane()}
                </Paper>
            </Box>
        </Box>
    );
}

export default SelectedSheetPage;

