import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../../header";
import { useApiRequestStatelessHook } from "../../hook/api-request-simple";
import { useGlobalLoading, GlobalLoadingContextType } from "../../loading/global-loading/provider";
import { fetch_sheets } from "../../../integration/fin-tool-api/sheets";
import { SheetResponse } from "../../../integration/fin-tool-api/responses";
import { Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import AddButton from "../AddButton";
import SheetForm from "./sheetForm";

const SheetListPanel: React.FC<{}> = ({ }) => {

    const [sheets, setSheets] = useState<Array<SheetResponse> | null>(null);
    const [openSheetForm, setOpenSheetForm] = useState<boolean>(false);
    const [anchorElUserSettings, setAnchorElUserSettings] = useState<HTMLButtonElement | null>(null);
    const { executeStatelessRequest: fetchSheets } = useApiRequestStatelessHook({ apiRequest: fetch_sheets });
    const { startLoading, finishLoading } = useGlobalLoading() as GlobalLoadingContextType;

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

    const openSettingsMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setAnchorElUserSettings(event.currentTarget);

    const closeSettingsMenu = () => setAnchorElUserSettings(null);

    const handleOpenSheetForm = () => setOpenSheetForm(true);

    const handleCloseSheetForm = () => setOpenSheetForm(false);

    const renderCard = (sheet: SheetResponse) => {
        return (
            <Card key={sheet.id} sx={{ width: '20em', }}>
                <CardHeader
                    title={
                        <Typography
                            variant="body1"
                            noWrap
                            component="a"
                            href={`/sheet/${sheet.id}`}
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            {sheet.name}
                        </Typography>
                    }
                    action={
                        <>
                        <IconButton aria-label="members">
                            <PersonIcon />
                        </IconButton>
                        <IconButton aria-label="settings" onClick={(e) => setAnchorElUserSettings(e.currentTarget)}>
                            <MoreVertIcon />
                        </IconButton>
                        </>
                        
                    }
                    subheader={`Criado em ${new Date(sheet.datCreation).toLocaleDateString()}`}
                />
            </Card>
        )
    }

    return (
        <ResponsiveAppBar>
            <Box display="flex" padding={4}>
            <>{sheets && sheets.map(item => <Box>{renderCard(item)}</Box>)}</>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUserSettings}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElUserSettings)}
                onClose={closeSettingsMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.text}
                    // onClick={() => onClickSettingsMenu(setting.action)}
                  >
                    <Typography textAlign="center">{setting.text}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AddButton onClick={handleOpenSheetForm}/>
            <SheetForm open={openSheetForm} handleClose={handleCloseSheetForm}/>
        </ResponsiveAppBar>
    )
}

export default SheetListPanel;