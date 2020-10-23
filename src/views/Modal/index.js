import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog({ isOpen, message, callback }) {
    const [open, setOpen] = React.useState(isOpen);

    const handleClickOpen = () => {

        setOpen(true);
    };

    const handleClose = () => {

        setOpen(false);

    };

    const handleContinue = () => {

        setOpen(false);
        callback()
    };
    return (
        <div>
            <Button
                onClick={handleClickOpen}
                style={{ width: "100%", backgroundColor: "#0b28ba", color: '#fff' }}
            // round
            >
                Pay with Cheque/Bank Transfer
</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Note"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Payment by cheque or bank transfer should be made within 7 working days, else your order will be automatically cancelled and you user account will be limited. Kindly click “Confirm” to Proceed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleContinue} color="primary" autoFocus>
                        Confirm
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

