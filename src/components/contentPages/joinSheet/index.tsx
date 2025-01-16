import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApiRequestStatelessHook } from '../../hook/api-request-simple';
import { accept_share_link_invite, fetch_sheet_share_info } from '../../../integration/fin-tool-api/sheets';
import { RetrieveShareSheetDataResponse } from '../../../integration/fin-tool-api/responses';
import { PopupProviderContextType, usePopup } from '../../popup/provider';
import ErrorPage from '../../errorPage';

const JoinSheetPage: React.FC<{}> = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState<any>(null);
    const [sheetInfo, setSheetInfo] = React.useState<RetrieveShareSheetDataResponse | null>(null);
    const { displaySuccessPopup } = usePopup() as PopupProviderContextType;

    const { executeStatelessRequest: retrieveInfo } = useApiRequestStatelessHook({apiRequest: fetch_sheet_share_info});
    const { executeStatelessRequest: acceptInvite } = useApiRequestStatelessHook({apiRequest: accept_share_link_invite});
    
    useEffect(() => { 
            retrieveInfo({token: token! })
                .then(res => {
                    setSheetInfo(res);
                    setOpen(true);
                })
                .catch(err => navigate("/"));        
    }, []);

    const handleClose = () => {
        setOpen(false);
        navigate("/");
    };

    const handleAccept = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {        
        e.isPropagationStopped();
        acceptInvite({token: token!})
        .then(res => {
            displaySuccessPopup(`Convite aceito.`, `A planilha ${res.sheetName} será adicionada na sua tela inicial.`);
        })
        .catch(err => {
            console.log(err);
            setError(err);
        })
        .finally(() => navigate("/"));
    }

    const renderSkeletons = () => {
        const skeleton = [];
        for (let count = 0; count < 50; count++) {
            skeleton.push(<Skeleton animation="wave" />)
        }
        return skeleton;
    }

    return (
        <Box>
            {!error && renderSkeletons()}
            {error && <ErrorPage error={error} />}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Convite para participar da planilha ${sheetInfo?.sheetName}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`${sheetInfo?.inviterName} está lhe convidando para participar da planilha ${sheetInfo?.sheetName}.
                         Ao concordar, a planilha será adicionada na sua tela inicial e você será capaz de acessa-la e gerencia-la.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Não</Button>
                    <Button onClick={handleAccept} autoFocus>
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default JoinSheetPage;