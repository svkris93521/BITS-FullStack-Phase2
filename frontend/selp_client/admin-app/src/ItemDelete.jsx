import * as React from 'react';
import { useEffect, useState } from 'react'

// Consolidated MUI Core Components
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Typography, Container, Card, CardContent, IconButton, 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Box, Button, Alert
} from '@mui/material';

// MUI Icons and Styling
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';


// --- Utility Functions for UI ---

/**
 * Maps item condition to a specific Material UI color palette value for visual feedback.
 * @param {string} condition - The condition string ('New', 'Good', 'Fair', 'Broken').
 * @returns {string} The corresponding MUI color key (e.g., 'success.main').
 */
const getConditionColor = (condition) => {
    switch (condition) {
        case 'New':
            return 'success.main'; 
        case 'Good':
            return 'info.main';    
        case 'Fair':
            return 'warning.main'; 
        case 'Broken':
            return 'error.main';   
        default:
            return 'grey.600';
    }
};

// --- Styled Components for Table ---

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // Professional Header Style
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.error.dark, // Using a deep red/maroon to emphasize deletion context
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // Subtle hover effect
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        cursor: 'pointer',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


// --- App Component (Main Export) ---
function ItemDelete() {
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);


    const fetchItems = async () => {
        try{
            const resp = await fetch("http://127.0.0.1:8000/selp/equipment/items");
            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
            
            const data = await resp.json();
            
            if (Array.isArray(data)) {
                setItems(data);
                if (data.length === 0) setMessage("Inventory is currently empty.");
                else setMessage('');
            } else {
                console.error("API response was not an array:", data); 
                setMessage("Error: Received invalid data format from server.");
            }
        } catch (err) {
            console.error(err);
            setMessage(`Error fetching data: ${err.message}. Check server connection.`);
        }
    }; 
    
    // Opens the confirmation dialog
    const handleOpenDialog = (item) => {
        setItemToDelete(item);
        setOpenDialog(true);
    };

    // Closes the confirmation dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setItemToDelete(null);
    };

    // Executes the deletion after confirmation
    const executeDelete = async () => {
        if (!itemToDelete) return;

        const { id, name } = itemToDelete;
        handleCloseDialog();
        setMessage(`Deleting item ${name}...`);

        try {
            const response = await fetch(`http://127.0.0.1:8000/selp/equipment/items/${id}`, {
                method: 'DELETE',
            });
            
            if (response.status === 204 || response.ok) { 
                setMessage(`Successfully deleted item "${name}"!`);
                // Filter the deleted item out of the current state for faster UI update
                setItems(prev => prev.filter(item => item.id !== id));
            } else {
                const errorText = await response.text();
                setMessage(`Error deleting item ${id}: ${errorText || response.statusText}`);
            }

        } catch (err) {
            console.error("Delete error:", err);
            setMessage(`Error: Deletion failed. ${err.message}`);
        }
    };

    // MUI Confirmation Dialog Component
    const DeleteConfirmationDialog = () => {
        if (!itemToDelete) return null;

        return (
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title" sx={{ color: 'error.dark', display: 'flex', alignItems: 'center' }}>
                    <WarningIcon sx={{ mr: 1, fontSize: 30 }} />
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-description" sx={{ mt: 1 }}>
                        Are you absolutely sure you want to permanently delete the item: 
                        <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            {" "}{itemToDelete.name}
                        </Box>? 
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.100' }}>
                    <Button 
                        onClick={handleCloseDialog} 
                        color="inherit" 
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={executeDelete} 
                        color="error" 
                        variant="contained" 
                        startIcon={<DeleteIcon />}
                        autoFocus
                        sx={{ borderRadius: 2 }}
                    >
                        Delete Item
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                    fontWeight: 700, 
                    color: 'error.dark', // Title reflects the destructive action
                    pb: 1, 
                    borderBottom: '2px solid',
                    borderColor: 'error.light'
                }}
            >
                Equipment Inventory Deletion
            </Typography>
            <Card elevation={5} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="deletion table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Item Name</StyledTableCell>
                                    <StyledTableCell align="center">Category</StyledTableCell>
                                    <StyledTableCell align="center">Condition</StyledTableCell>
                                    <StyledTableCell align="right">Quantity</StyledTableCell>
                                    <StyledTableCell align="right">Available</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <StyledTableRow key={item.id || item.name + index}>
                                        <StyledTableCell component="th" scope="row">{item.name}</StyledTableCell>
                                        <StyledTableCell align="center">{item.category}</StyledTableCell>
                                        
                                        {/* Condition Badge */}
                                        <StyledTableCell align="center">
                                            <Box 
                                                sx={{
                                                    display: 'inline-block',
                                                    p: '4px 10px',
                                                    borderRadius: '16px', 
                                                    bgcolor: getConditionColor(item.condition),
                                                    color: 'white',
                                                    fontWeight: 'medium',
                                                    minWidth: '80px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                }}
                                            >
                                                {item.condition}
                                            </Box>
                                        </StyledTableCell>

                                        <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                                        <StyledTableCell align="right">{item.availability}</StyledTableCell>
                                        
                                        {/* Delete Button */}
                                        <StyledTableCell align="center">
                                            <IconButton 
                                                aria-label={`delete item ${item.name}`} 
                                                color="error"
                                                onClick={() => handleOpenDialog(item)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                {/* Display a row if the list is empty */}
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            No equipment items found for deletion.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>  
                </CardContent>
            </Card>

            {/* Alert for user feedback */}
            {message && (
                <Alert 
                    severity={message.startsWith("Error") || message.startsWith("Erorr") ? 'error' : 'info'} 
                    sx={{ mt: 3, borderRadius: 2 }}
                >
                    {message}
                </Alert>
            )}

            <DeleteConfirmationDialog />
        </Container>
    );
}

export default ItemDelete;