import React, { RefObject, useRef } from 'react';
import { SheetResponse } from '../../../../integration/fin-tool-api/responses';
import { Card, CardHeader, Tooltip, Typography, IconButton, Grid2 } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from "@mui/styles";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    open: {
        transform: "rotate(0.0turn)",
    },
    close: {
        transform: "rotate(0.5turn)",
    },
}));

export interface SheetCardParams {
    sheet: SheetResponse,
    selectSheet: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, sheetId: number) => void,
    isSelected: Boolean
}

const SheetCard: React.FC<SheetCardParams> = (sheetCardParams: SheetCardParams) => {

    const classes = useStyles();

    const {
        sheet,
        selectSheet,
        isSelected
    } = sheetCardParams;


    return (
        <Grid2
            key={sheet.id}
            size={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 2 }}
            sx={{ textAlign: 'center' }}
            display="flex"
            justifyContent="center"
        >
            <Card key={sheet.id} sx={{ marginTop: '1rem', width: '20rem', maxWidth: '90%' }}>
                <CardHeader
                    title={
                        <Tooltip title={`Criado por ${sheet.createdBy} em ${new Date(sheet.datCreation).toLocaleDateString()}`}>
                            <Typography
                                noWrap
                                component="a"
                                href={`/sheets/${sheet.id}`}
                                sx={{
                                    fontSize: '1.3rem',
                                    fontWeight: 700,
                                    letterSpacing: '.2rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    textAlign: 'start'
                                }}
                            >
                                {sheet.name}
                            </Typography>
                        </Tooltip>
                    }
                    action={
                        <IconButton
                            aria-label="Mais"
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => selectSheet(e, sheet.id) }
                        >
                            <ExpandMoreIcon
                            className={clsx(!isSelected && classes.close, isSelected && classes.open)}
                            />
                        </IconButton>
                    }
                />
            </Card>
        </Grid2>
    )
}

export default SheetCard;