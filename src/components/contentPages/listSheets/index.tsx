import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../../header";
import { useApiRequestStatelessHook } from "../../hook/api-request-simple";
import { useGlobalLoading, GlobalLoadingContextType } from "../../loading/global-loading/provider";
import { fetch_sheets, share_sheet } from "../../../integration/fin-tool-api/sheets";
import { SheetResponse } from "../../../integration/fin-tool-api/responses";
import { Grid2, Typography } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import FabButtonMenu from "../FabButtonMenu";
import SheetForm from "./sheetForm";
import AddIcon from '@mui/icons-material/Add';
import { usePopup, PopupProviderContextType } from "../../popup/provider";
import SheetCard from "./sheetCard";

const SheetListPanel: React.FC<{}> = ({ }) => {
    
    const [sheets, setSheets] = useState<Array<SheetResponse> | null>(null);
    const [selectedSheet, setSelectedSheet] = useState<number | null>(null);
    const [openSheetForm, setOpenSheetForm] = useState<boolean>(false);  

    const { executeStatelessRequest: fetchSheets } = useApiRequestStatelessHook({ apiRequest: fetch_sheets });
    const { executeStatelessRequest: createShareLink } = useApiRequestStatelessHook({ apiRequest: share_sheet });
    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
    const { displaySuccessPopup, displayErrorPopup } = usePopup() as PopupProviderContextType;

    const copyShareLinkToClipBoard = () => {
        startLoading();
        createShareLink({ sheetId: selectedSheet!! })
            .then(res => {
                navigator.clipboard.writeText(res.link)
                displaySuccessPopup("Compartilhamento de Planilha", "Link copiado para área de transferência")
            })
            .catch(err => console.error(err))
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

    const selectSheet = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        sheetId: number,
    ) => {
        if (selectedSheet === sheetId) {
            setSelectedSheet(null);
        } else {            
            setSelectedSheet(sheetId)            
        }
    }

    const handleOpenSheetForm = () => setOpenSheetForm(true);

    const handleCloseSheetForm = () => {
        setOpenSheetForm(false);
        retrieveSheets();
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
            <Grid2
                mt={4}
                mb={14}
                container
                sx={{ width: '100%' }}
                display="flex"
                justifyContent="flex-start"
            >
                {sheets && sheets.map(item => <SheetCard sheet={item} selectSheet={selectSheet} isSelected={item.id === selectedSheet}/>)}
            </Grid2>
            <FabButtonMenu {...{
                options: [
                    { label: 'Criar', onClick: handleOpenSheetForm, Icon: AddIcon, color: 'info', show: true },
                    { label: 'Editar', onClick: handleOpenSheetForm, Icon: EditIcon, color: 'info', show: selectedSheet != null },
                    { label: 'Compartilhar', onClick: copyShareLinkToClipBoard, Icon: ShareIcon, color: 'info', show: selectedSheet != null },
                    // { label: 'Remover', onClick: handleOpenSheetForm, Icon: DeleteIcon, color: 'info', show: selectedSheet != null }
                ]
            }}
            />
            {openSheetForm && <SheetForm sheetId={selectedSheet} open={openSheetForm} handleClose={handleCloseSheetForm} />}
        </ResponsiveAppBar>
    )
}

export default SheetListPanel;
