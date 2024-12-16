import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../../header";
import { useApiRequestStatelessHook } from "../../hook/api-request-simple";
import { useGlobalLoading, GlobalLoadingContextType } from "../../loading/global-loading/provider";
import { fetch_sheets, share_sheet } from "../../../integration/fin-tool-api/sheets";
import { SheetResponse } from "../../../integration/fin-tool-api/responses";
import { Card, CardHeader, Grid, IconButton, Tooltip, Typography } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import FabButtonMenu from "../FabButtonMenu";
import SheetForm from "./sheetForm";
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { usePopup, PopupProviderContextType } from "../../popup/provider";


const useStyles = makeStyles(theme => ({
    open: {
        transform: "rotate(0.0turn)",
    },
    close: {
        transform: "rotate(0.5turn)",
    },
}));

const SheetListPanel: React.FC<{}> = ({ }) => {

    const classes = useStyles();

    const [sheets, setSheets] = useState<Array<SheetResponse> | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedSheet, setSelectedSheet] = useState<number | null>(null);
    const [openSheetForm, setOpenSheetForm] = useState<boolean>(false);
    const [anchorElUserSettings, setAnchorElUserSettings] = useState<HTMLButtonElement | null>(null);
    const { executeStatelessRequest: fetchSheets } = useApiRequestStatelessHook({ apiRequest: fetch_sheets });
    const { executeStatelessRequest: createShareLink } = useApiRequestStatelessHook({ apiRequest: share_sheet });
    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
    const { displaySuccessPopup, displayErrorPopup } = usePopup() as PopupProviderContextType;

    const copyShareLinkToClipBoard = () => {
        startLoading();
        createShareLink({sheetId: selectedSheet!!})
        .then(res => {
            navigator.clipboard.writeText(res.link)
            displaySuccessPopup("Compartilhamento de Planilha", "Link copiado para área de transferência")        
        })
        .catch(err => console.log(err))
        .finally(() => finishLoading());
    }

    const retrieveSheets = () => {
        startLoading();
        fetchSheets(null)
            .then(data => setSheets(data.content))
            .catch(err => console.log(err))
            .finally(() => finishLoading());        
    }

    useEffect(() => {        
        retrieveSheets();
    }, [])    

    const selectSheet = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, sheetId: number) => {
        
        if (selectedSheet === sheetId) {
            setSelectedSheet(null);
            setOpen(false);
        } else {
            setOpen(true)
            setSelectedSheet(sheetId)
            event.stopPropagation()
        }        
    }    

    const handleOpenSheetForm = () => setOpenSheetForm(true);

    const handleCloseSheetForm = () => {
        setOpenSheetForm(false);
        retrieveSheets();
    }

    const renderCard = (sheet: SheetResponse) => {

        return (
            <Grid
                key={sheet.id}
                item
                xs={12}
                sm={12}
                md={4}
                lg={3}
                xl={2}
                sx={{ textAlign: 'center' }}
                display="flex"
                justifyContent="center"
            >

                <Card key={sheet.id} sx={{ marginTop: '1rem', width: '20rem', maxWidth: '90%' }}>
                    <CardHeader
                        title={
                            <Tooltip title={`Criado ${new Date(sheet.datCreation).toLocaleDateString()}`}>
                                <Typography
                                    noWrap
                                    component="a"
                                    href={`/sheet/${sheet.id}`}
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
                                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => selectSheet(e, sheet.id)}
                            >
                                <ExpandMoreIcon 
                                className={clsx(!open && classes.close, open && classes.open)} 
                                />
                            </IconButton>
                        }

                    />

                </Card>
            </Grid>
        )
    }

    return (
        <ResponsiveAppBar>
            <Typography
                mt={5}
                ml={4}
                variant="h5"
                noWrap
                sx={{
                    fontWeight: 700,
                    letterSpacing: '.2rem',
                    color: 'whitesmoke',
                    textDecoration: 'none',
                    textAlign: 'start'
                }}
            >
                Minhas Planilhas
            </Typography>
            <Grid
                mt={4}
                mb={14}
                container
                sx={{ width: '100%' }}
                display="flex"
                justifyContent="flex-start"
            >
                {sheets && sheets.map(item => renderCard(item))}
            </Grid>
            <FabButtonMenu {...{
                options: [
                    { label: 'Criar', onClick: handleOpenSheetForm, Icon: AddIcon, color: 'info', show: true },
                    { label: 'Editar', onClick: handleOpenSheetForm, Icon: EditIcon, color: 'info', show: selectedSheet != null },
                    { label: 'Compartilhar', onClick: copyShareLinkToClipBoard, Icon: ShareIcon, color: 'info', show: selectedSheet != null },
                    // { label: 'Remover', onClick: handleOpenSheetForm, Icon: DeleteIcon, color: 'info', show: selectedSheet != null }
                ]
            }}
            />
            <SheetForm sheetId={selectedSheet} open={openSheetForm} handleClose={handleCloseSheetForm} />
        </ResponsiveAppBar>
    )
}

export default SheetListPanel;
