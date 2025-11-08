import * as React from 'react';
import { useEffect, useState } from 'react'

// Consolidated MUI Imports
import { 
    Typography, Container, styled, Table, TableBody, TableCell, 
    tableCellClasses, TableContainer, TableHead, TableRow, Paper, 
    Card, CardContent, Box, IconButton 
} from '@mui/material';

// Icon for the Actions column
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '/src/App'; 



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
    // Enhanced Header Style
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main, // Using primary color for a professional look
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
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    // Subtle hover effect
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        cursor: 'default',
    }
}));


// --- App Component (Main Export) ---
function ItemList() {
    const [items, setItems] = useState([]);
    // useAuth variables are now mocked above
    // MOCK: Replacing external hook with local variables to fix "Could not resolve" error
  const { user, username, isAuthenticated, logoutUser, role } = useAuth();

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
            } else {
                console.error("API response was not an array:", data); 
            }
        } catch (err) {
            console.error(err);
        }
    }; 
    
    return (
        <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                    fontWeight: 700, 
                    color: 'primary.dark',
                    pb: 1, // Add bottom padding for separation
                    borderBottom: '2px solid',
                    borderColor: 'grey.300'
                }}
            >
                Equipment Inventory List
            </Typography>
            {/* Added elevation and border radius to the card */}
            <Card elevation={5} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}> {/* Remove card padding since TableContainer handles it */}
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized inventory table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Item Name</StyledTableCell>
                                    <StyledTableCell align="center">Category</StyledTableCell>
                                    <StyledTableCell align="center">Condition</StyledTableCell>
                                    <StyledTableCell align="right">Quantity</StyledTableCell>
                                    <StyledTableCell align="right">Available</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell> {/* Added Action Column */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <StyledTableRow key={item.id || item.name + index}>
                                        <StyledTableCell component="th" scope="row">{item.name}</StyledTableCell>
                                        <StyledTableCell align="center">{item.category}</StyledTableCell>
                                        
                                        {/* Condition Badge Enhancement */}
                                        <StyledTableCell align="center">
                                            <Box 
                                                sx={{
                                                    display: 'inline-block',
                                                    p: '4px 10px',
                                                    borderRadius: '16px', // Pill shape
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
                                        
                                        {/* Actions Column with placeholder icon */}
                                        <StyledTableCell align="center">
                                            <IconButton 
                                                aria-label={`view details for ${item.name}`} 
                                                color="primary"
                                                onClick={() => console.log('View details for:', item.name)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                {/* Display a row if the list is empty */}
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            No equipment items found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>  
                </CardContent>
            </Card>
        </Container>
    );
}

export default ItemList;