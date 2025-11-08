import * as React from 'react';
import { useEffect, useState, useMemo, useCallback } from 'react'; 
import {
    Container, Typography, Card, CardContent, CardActions, IconButton, Box, Button, 
    Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Paper,
    FormControl, InputLabel, Select, MenuItem, TextField,
    styled
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Dialog, DialogTitle } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import './App.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { useAuth } from '/src/App';


const CATEGORIES = ['sports', 'lab', 'cameras', 'musical', 'project'];



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
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
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


function StudentRequest() {
    const [items, setItems] = useState([]);
    const [lending, setLending] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusLendMessage, setLendStatusMessage] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [availableFromDate, setAvailableFromDate] = useState('');
    const [availableToDate, setAvailableToDate] = useState('');
    const [formData, setFormData] = useState({}); 


    const { user, username, isAuthenticated } = useAuth();



    const fetchItems = useCallback(async () => {
        setStatusMessage('');


        if (availableFromDate && availableToDate && dayjs(availableFromDate).isAfter(dayjs(availableToDate), 'day')) {
             setItems([]);
             setStatusMessage("Error: The 'Available From' date cannot be after the 'Available To' date.");
             return;
        }
        
        const queryParams = new URLSearchParams();
        
        if (selectedCategory !== 'all') {
            queryParams.append('category', selectedCategory);
        }

        const fromDate = availableFromDate ? dayjs(availableFromDate).format('YYYY-MM-DD') : null;
        const toDate = availableToDate ? dayjs(availableToDate).format('YYYY-MM-DD') : null;

        if (fromDate) {
            queryParams.append('from_date', fromDate);
        }
        if (toDate) {
            queryParams.append('to_date', toDate);
        }

        const url = `http://127.0.0.1:8000/selp/lending/items/available/?${queryParams.toString()}`;
        //confirm('URL'+url)
        
        //confirm(queryParams.size);
        try {
            const resp = await fetch(url);
            
            if (!resp.ok) {
                const err = await resp.text();
                throw new Error(`HTTP error! Status: ${resp.status}. Message: ${err || resp.statusText}`);
            }

            const data = await resp.json();

            if (Array.isArray(data)) {
                setItems(data);
                console.log(data);
                setStatusMessage(`Successfully loaded ${data.length} items.`);
            } else {
                console.error("API response was not an array:", data);
                setStatusMessage("Error: API returned an unexpected data format.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setStatusMessage(`Error: Failed to load inventory or check availability. Please ensure the backend is running and dates are valid.`);
        }
    }, [selectedCategory, availableFromDate, availableToDate]);

    useEffect(() => {
        if(selectedCategory!=='all' && availableFromDate && availableToDate)
        {
        fetchItems();
        }
    }, [fetchItems, availableFromDate, availableToDate]);

    const handleLendRequest = async (item, f_date, t_date) => {
        //confirm("lend="+item.name);
    setLending({
        user_id: user,
        item_id: item.id,
        name: item.name,
        category: item.category,
        condition: item.condition,
        from_date: f_date,
        to_date: t_date,
        quantity: item.quantity,
        availability: item.availability,
        purpose: "<Tell us briefly about your request!!!>"
    });
    setFormData({
        user_id: user,
        item_id: item.id,
        name: item.name,
        category: item.category,
        condition: item.condition,
        from_date: f_date,
        to_date: t_date,
        quantity: item.quantity,
        availability: item.availability,
        purpose: "<briefly about your request!>"
    });
    //confirm("AFTER lend, user="+user);
  };

          const userListPage = async () => {  
      try {
            nextPage('/Student');
        } catch (err) {
            console.log(err);
        } 
        };

const createLendData = async (fPurp) => {
    //confirm("fpurp="+fPurp +" user="+user + " item_id="+lending.item_id);
    lending.purpose = fPurp;
    await createLendingRequest();
    //confirm("AFTER lend, user="+user);
  };

  const createLendingRequest = async () => {
    //window.confirm(`Are you sure you want to CREATE REQUEST ${JSON.stringify(lending)}!!`)

    const lendingRequestDetail = {
        requester: user,
        item: lending.item_id,
        quantity: lending.quantity,
        from_date: dayjs(lending.from_date).format('YYYY-MM-DD'),
        to_date: dayjs(lending.to_date).format('YYYY-MM-DD'),
        status: "new",
        requested_date: dayjs().format('YYYY-MM-DD'),
        purpose: lending.purpose
      }

    setLendStatusMessage(`Creating lending request ...`);
    console.log("SAVE lending", JSON.stringify(lendingRequestDetail))
    try {
        const response = await fetch(`http://127.0.0.1:8000/selp/lending/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lendingRequestDetail), 
      });
      
      if (response.status === 204 || response.ok) {
          setStatusMessage(`Successfully created lending request !`);
          setLending(null);
      } else {
          const errorText = await response.text();
          setStatusMessage(`Error creating Lending request: ${errorText || response.statusText}`);
      }

    } catch (err) {
      console.error("Delete error:", err);
      setStatusMessage(`Error: Updation failed. ${err.message}`);
    }

  };
  
  
  const handleCloseModal = () => {
    setLending(null);
    setFormData({});
  };

  const EditModal = () => {
    if (!lending) return null;
    //confirm("lending="+lending)
    const [purp, setPurpose] = useState("Tell us about the purpose of our request...");

  
    const max_lending = lending.quantity;
    const updateField = (field, value) => {
            setLending(prev => ({ 
                ...prev, 
                [field]: value 
            }));
        }

    const formatDateDisplay = (dateString) => {
            if (!dateString) return '';
            // DateString is in YYYY-MM-DD format (stored in lending object)
            return dayjs(dateString).format('DD-MMM-YYYY');
        };

    return (
        <Dialog open={!!lending} onClose={handleCloseModal} maxWidth="sm" fullWidth>
            <DialogTitle>Requesting Item: {lending.name}</DialogTitle>
        <Card raised>
          <CardContent>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                label="Item Name" 
                variant="outlined" 
                fullWidth
                value={lending.name}
                //onChange={(e) => updateField('name', e.target.value)}
                disabled
              />
              <TextField 
                label="Category" 
                variant="outlined" 
                fullWidth
                value={lending.category}
                //onChange={(e) => updateField('name', e.target.value)}
                disabled
              />
              
              <TextField 
                                label="Total Quantity" 
                                type="number" 
                                variant="outlined" 
                                fullWidth
                                value={lending.quantity}
                                inputProps={{ min: 1 }}
                                onChange={(e) => updateField('quantity', e.target.value)}
                                required
                              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  label="From" 
                  type="text" 
                  variant="outlined" 
                  fullWidth
                  //value={dayjs(formData.from_date).format('YYYY-MM-DD')}
                  value={formatDateDisplay(formData.from_date)}
                  //onChange={(e) => updateField('purpose', e.target.value)}
                  disabled
                />
                
                <TextField 
                  label="To" 
                  type="text" 
                  variant="outlined" 
                  fullWidth
                  //value={dayjs(formData.from_date).format('YYYY-MM-DD')}
                  value={formatDateDisplay(formData.to_date)}
                  //onChange={(e) => updateField('quantity', e.target.value)}
                  disabled
                />
              </Box>
              <TextField
                id="tf_purpose"
                label="Request Purpose"
                multiline
                rows={3}
                //maxRows={3}
                //value={lending.purpose}
                value = {purp}
                //onChange={(e) => updateField('purpose', e.target.value)}
                onChange={(e) => setPurpose(e.target.value)}
                fullWidth
                inputProps={{ maxLength: 180 }}
                />
              
            </Box>
            {statusLendMessage && (
                <Typography 
                    variant="body2" 
                    sx={{ mt: 2, color: statusLendMessage.startsWith("Error") ? 'error.main' : 'primary.main' }}
                >
                    {statusLendMessage}
                </Typography>
            )}
          </CardContent>
          
          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleCloseModal}
                    sx={{ mr: 1 }}
                >
                    Cancel
                </Button>
                <Button 
                variant="contained" 
                color="primary" 
                //onClick={createLendingRequest}
                onClick={() => createLendData(purp)}
                startIcon={<SaveIcon />}
                >
                Create
                </Button>
          </CardActions>
        </Card>
        
        </Dialog>
    );
  };


    return (
        <>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Equipment Lending Portal
            </Typography>
            <Card elevation={5}>
                <CardContent>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            gap: 3, 
                            mb: 3, 
                            alignItems: 'center', 
                            flexWrap: 'wrap' 
                        }}
                    >
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
                            <Select
                                labelId="category-filter-label"
                                id="category-filter"
                                value={selectedCategory}
                                label="Filter by Category"
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <MenuItem value="all">
                                    <em>Select Category</em>
                                </MenuItem>
                                {CATEGORIES.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                       <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Available From" minDate={dayjs()}
                            onChange={(val) => setAvailableFromDate(val)} />
                        </LocalizationProvider>
                       <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Available To" minDate={dayjs()}
                            onChange={(val) => setAvailableToDate(val)} />
                        </LocalizationProvider>
                        
                    </Box>
                    
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="Lending Request Table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Item Name</StyledTableCell>
                                    <StyledTableCell align="center">Category</StyledTableCell>
                                    <StyledTableCell align="center">Condition</StyledTableCell>
                                    <StyledTableCell align="right">Quantity Available</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <StyledTableRow key={item.id || item.name}>
                                        <StyledTableCell align="left">{item.name}</StyledTableCell>
                                        <StyledTableCell align="center">{item.category}</StyledTableCell>
                                        <StyledTableCell align="center">{item.condition}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {/* Quantity Available is currently the item's static 'availability' field */}
                                            {item.availability}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                endIcon={<SendIcon />}
                                                onClick={() => handleLendRequest(item, availableFromDate, availableToDate)}
                                                // Disable button if nothing is available
                                                disabled={item.availability <= 0} 
                                            >
                                                Request
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {statusMessage && (
                        <Typography
                            variant="body2"
                            sx={{ mt: 2, color: statusMessage.startsWith("Error") ? 'error.main' : 'primary.main' }}
                        >
                            {statusMessage}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Container>
        <EditModal />
        </>
    );
}

export default StudentRequest;
