import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../../header";
import { useApiRequestStatelessHook } from "../../hook/api-request-simple";
import { useGlobalLoading, GlobalLoadingContextType } from "../../loading/global-loading/provider";
import { fetch_sheets } from "../../../integration/fin-tool-api/sheets";
import { SheetResponse } from "../../../integration/fin-tool-api/responses";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import FabButtonMenu from "../FabButtonMenu";
import SheetForm from "./sheetForm";
import AddIcon from '@mui/icons-material/Add';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigationIcon from '@mui/icons-material/Navigation';


// const useStyles = makeStyles({
//     openX: {
//       transform: "scaleX(1)"
//     },
//     closeX: {
//       transform: "scaleX(-1)"
//     },
//     openY: {
//       transform: "scaleY(1)"
//     },
//     closeY: {
//       transform: "scaleY(-1)"
//     }
//   });
// const useStyles = makeStyles ({
//     openX: {
//       transform: "scaleX(1)"
//     },
//     closeX: {
//       transform: "scaleX(-1)"
//     },
//     openY: {
//       transform: "scaleY(1)"
//     },
//     closeY: {
//       transform: "scaleY(-1)"
//     }
//   });

const SheetListPanel: React.FC<{}> = ({ }) => {

    

    const [sheets, setSheets] = useState<Array<SheetResponse> | null>(null);
    const [selectedSheet, setSelectedSheet] = useState<number | null>(null);
    const [openSheetForm, setOpenSheetForm] = useState<boolean>(false);
    const [anchorElUserSettings, setAnchorElUserSettings] = useState<HTMLButtonElement | null>(null);
    const { executeStatelessRequest: fetchSheets } = useApiRequestStatelessHook({ apiRequest: fetch_sheets });
    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;
    // const classes = useStyles();
    useEffect(() => {
        const retrieveSheets = () => fetchSheets(null)
            .then(data => setSheets(data.content))
            .catch(err => console.log(err))
            .finally(() => finishLoading());
        startLoading();
        retrieveSheets();
    }, [])

    const settings = [
        { text: 'Excluir', action: () => console.log('removendo') },
    ];

    const selectSheet = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, sheetId: number) => {
        if (selectedSheet === sheetId) 
            setSelectedSheet(null);
        else {
            setSelectedSheet(sheetId)
            event.stopPropagation()
        }

        
        // setAnchorElUserSettings(event.currentTarget);
    }

    const closeSettingsMenu = () => setAnchorElUserSettings(null);

    const handleOpenSheetForm = () => setOpenSheetForm(true);

    const handleCloseSheetForm = () => setOpenSheetForm(false);

    const renderCard = (sheet: SheetResponse) => {
        function clsx(arg0: boolean, arg1: any): string | undefined {
            throw new Error("Function not implemented.");
        }

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
                                    // variant="body1"
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
                                aria-label="Membros"
                                onClick={(e) => selectSheet(e, sheet.id)}
                                // className={clsx(selectedSheet === null && classes.closeX, selectedSheet != null && classes.openX)}
                            // onClick={(e) => setAnchorElUserSettings(e.currentTarget)}
                            >
                                <ExpandMoreIcon />
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
                    { label: 'Compartilhar', onClick: handleOpenSheetForm, Icon: ShareIcon, color: 'info', show: selectedSheet != null },
                    { label: 'Remover', onClick: handleOpenSheetForm, Icon: DeleteIcon, color: 'info', show: selectedSheet != null }
                ]
            }}
            />
            <SheetForm open={openSheetForm} handleClose={handleCloseSheetForm} />
        </ResponsiveAppBar>
    )
}

export default SheetListPanel;
