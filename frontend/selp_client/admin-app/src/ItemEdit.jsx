import * as React from 'react';
import { useEffect, useState } from 'react'

// Material UI Core Components
import { 
    Dialog, DialogTitle, Card, CardContent, CardActions, Typography, 
    TextField, Button, Box, Container, FormControl, InputLabel, Select, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert,
    IconButton
} from '@mui/material';

// Material UI Icons and Styling
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

// The following import caused an error and has been removed:
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
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark, // Use theme primary color for header
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
}));


// --- App Component (Main Export) ---
function ItemList() {
    // State Hooks
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState('');
    const [editItem, setEditItem] = useState(null); 
    const [formData, setFormData] = useState({}); 

    // Auth Context Mock: 
    // These variables are now hardcoded to resolve the "Could not resolve" import error.

  const { user, username, isAuthenticated, logoutUser, role } = useAuth();

    // Static Data
    const categories = ['sports', 'lab', 'cameras', 'musical', 'project'];
    const condition_type = ['New', 'Good', 'Fair', 'Broken'];


    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try{
            // NOTE: Using a mock URL; replace with actual API endpoint
            const resp = await fetch("http://127.0.0.1:8000/selp/equipment/items"); 
            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
            
            const data = await resp.json();
            
            if (Array.isArray(data)) {
                setItems(data);
                if (data.length > 0) {
                    setMessage("Inventory data loaded successfully.");
                } else {
                    setMessage("Inventory is empty. Add new items.");
                }
            } else {
                console.error("API response was not an array:", data); 
                setMessage("Error: Received invalid data format from server.");
            }
        } catch (err) {
            console.error(err);
            setMessage(`Error fetching data: ${err.message}. Check server connection.`);
        }
    }; 

    const handleEdit = (item) => {
        // Create a deep copy of the item to edit, preventing direct state modification
        setEditItem({...item}); 
    };

    const updateItem = async () => {
        if (!editItem) return;

        setMessage(`Updating item ${editItem.name}...`);

        try {
            // NOTE: Using a mock URL; replace with actual API endpoint
            const response = await fetch(`http://127.0.0.1:8000/selp/equipment/items/edit/${editItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // If proper auth was available, a token might be added here:
                    // 'Authorization': `Bearer ${user.token}` 
                },
                body: JSON.stringify(editItem), 
            });
            
            if (response.status === 204 || response.ok) { 
                setMessage(`Successfully updated item ${editItem.name}!`);
                fetchItems(); 
                setEditItem(null); // Close modal
            } else {
                const errorText = await response.text();
                setMessage(`Error updating item ${editItem.id}: ${errorText || response.statusText}`);
            }

        } catch (err) {
            console.error("Update error:", err);
            setMessage(`Error: Update failed. ${err.message}`);
        }
    };
    
    
    const handleCloseModal = () => {
        setEditItem(null);
    };

    const EditModal = () => {
        if (!editItem) return null;

        const updateField = (field, value) => {
            // Update the temporary editItem state
            setEditItem(prev => ({ 
                ...prev, 
                [field]: value 
            }));
        }

        return (
            // Added padding/spacing and clear distinction between title/content
            <Dialog open={!!editItem} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: 'primary.main', borderBottom: '1px solid', borderColor: 'grey.200', mb: 2 }}>
                    Edit Item: <Box component="span" sx={{ fontWeight: 'bold' }}>{editItem.name}</Box>
                </DialogTitle>
                
                {/* Removed 'raised' prop on Card as Dialog handles shadow, focusing on content */}
                <Card sx={{ boxShadow: 'none' }}> 
                    <CardContent>
                        {/* Increased gap for better spacing */}
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}> 
                            <TextField 
                                label="Item Name" 
                                variant="outlined" 
                                fullWidth
                                value={editItem.name || ''}
                                onChange={(e) => updateField('name', e.target.value)}
                                required
                                color="primary"
                            />
                            
                            <FormControl fullWidth variant="outlined" required color="primary">
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="category-select"
                                    value={editItem.category || ''}
                                    label="Category"
                                    onChange={(e) => updateField('category', e.target.value)}
                                >
                                    {categories.map((catid) => (
                                        <MenuItem key={catid} value={catid} >
                                            {catid}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <FormControl fullWidth variant="outlined" required color="primary">
                                <InputLabel id="condition-label">Condition</InputLabel>
                                <Select
                                    labelId="condition-label"
                                    id="condition-select"
                                    value={editItem.condition || ''}
                                    label="Condition"
                                    onChange={(e) => updateField('condition', e.target.value)}
                                >
                                    {condition_type.map((condid) => (
                                        <MenuItem key={condid} value={condid}>
                                            {condid}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField 
                                    label="Total Quantity" 
                                    type="number" 
                                    variant="outlined" 
                                    fullWidth
                                    value={editItem.quantity}
                                    onChange={(e) => updateField('quantity', e.target.value)}
                                    required
                                    color="primary"
                                    inputProps={{ min: 0 }}
                                />
                                
                                <TextField 
                                    label="Currently Available" 
                                    type="number" 
                                    variant="outlined" 
                                    fullWidth
                                    value={editItem.availability}
                                    onChange={(e) => updateField('availability', e.target.value)}
                                    color="primary"
                                    inputProps={{ min: 0, max: editItem.quantity || undefined }}
                                />
                            </Box>
                        </Box>
                        {/* Removed result typography as main component message Alert handles feedback */}
                    </CardContent>
                    
                    {/* Clear separation for action buttons */}
                    <CardActions sx={{ justifyContent: 'flex-end', p: 3, borderTop: '1px solid', borderColor: 'grey.100' }}>
                        <Button 
                            variant="outlined" 
                            color="error" // Use error color for cancel
                            onClick={handleCloseModal}
                            sx={{ mr: 1, borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={updateItem}
                            startIcon={<SaveIcon />}
                            sx={{ borderRadius: 2 }}
                        >
                            Save Changes
                        </Button>
                    </CardActions>
                </Card>
            </Dialog>
        );
    };

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.dark' }}>
                    Equipment Inventory Management
                </Typography>
                <Card elevation={5} sx={{ borderRadius: 2 }}>
                    <CardContent>
                        <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
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
                                        // Added index to key to prevent warnings if item.id is missing or null
                                        <StyledTableRow key={item.id || item.name + index}> 
                                            <StyledTableCell align="left" component="th" scope="row">{item.name}</StyledTableCell>
                                            <StyledTableCell align="center">{item.category}</StyledTableCell>
                                            
                                            {/* Enhanced Condition Display with a color badge */}
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
                                            <StyledTableCell align="center">
                                                <IconButton 
                                                    aria-label={`edit item ${item.name}`} 
                                                    color="primary" // Use primary color for edit icon
                                                    onClick={() => handleEdit(item)} 
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>  
                        
                        {/* Replaced Typography with MUI Alert component */}
                        {message && (
                            <Alert 
                                severity={message.startsWith("Error") || message.startsWith("Erorr") ? 'error' : 'success'} 
                                iconMapping={{
                                    success: <CheckCircleOutlineIcon fontSize="inherit" />,
                                }}
                                sx={{ mt: 3, borderRadius: 2 }}
                            >
                                {message}
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Container>

            <EditModal />
        </>
    );
}

export default ItemList; // Updated export name to match function name