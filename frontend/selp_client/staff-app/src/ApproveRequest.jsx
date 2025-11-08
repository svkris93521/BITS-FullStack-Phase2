import * as React from 'react';
import { useEffect, useState } from 'react'; 
import {
    Container, Typography, Card, CardContent, Button, 
    Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Paper,
    styled, Box, Alert,
    // Added imports for filtering UI
    TextField, Chip
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check'; 
import ClearIcon from '@mui/icons-material/Clear'; 
import SendIcon from '@mui/icons-material/Send';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import dayjs from 'dayjs'; 
import { useAuth } from '/src/App';

// MOCK: Replacing external hook with local variables to fix "Could not resolve" error
const user = 'mock-staff-id-456'; 
const username = 'Lending Staff';
const isAuthenticated = true;


// --- Utility Constants & Functions for UI ---

// Defines the available status options for filtering
const ALL_STATUSES = ['new', 'approved', 'issued', 'rejected', 'returned'];

/**
 * Maps request status to a specific Material UI color palette value for badges.
 */
const getStatusColor = (status) => {
    switch (status) {
        case 'new':
            return 'info.main';       // Blue for new/pending
        case 'approved':
            return 'success.main';    // Green for approved
        case 'issued':
            return 'warning.main';    // Orange for issued
        case 'returned':
            return 'primary.dark';    // Dark Blue for successfully returned
        case 'rejected':
            return 'error.main';      // Red for rejected
        default:
            return 'grey.500';
    }
};

// --- Styled Components for Table ---

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
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
        cursor: 'default',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


function ApproveRequest() {
    const [lending, setLending] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
      const { user, username, isAuthenticated, logoutUser, role } = useAuth();
    
    // State for Requester Name Search
    const [searchTerm, setSearchTerm] = useState('');
    
    // State for Status Chip Filter, defaulting to 'all' to show all rows
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');


    const fetchRequests = async () => {
        setStatusMessage('');
        if(!user) {
            setStatusMessage("Error: Invalid session. Please log in.");
            return;
        }
        
        try {
            const resp = await fetch(`http://127.0.0.1:8000/selp/lending/staff/`);
            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
            
            const data = await resp.json();
            
            if (Array.isArray(data)) {
                setLending(data);
                if (data.length === 0) setStatusMessage("No lending requests found.");
            } else {
                console.error("API response was not an array:", data); 
                setStatusMessage("Error: Received invalid data format from server.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setStatusMessage(`Error fetching data: ${err.message}.`);
        }
    };

    const handleUpdateStatus = async (requestId, status) => {
        setStatusMessage(`Updating request to ${status}...`);
        let req_body = "";
        if(!user) {
            setStatusMessage("Error: Invalid session.");
            return;
        }

        switch (status) {
            case 'approved':
            case 'rejected':
                req_body = JSON.stringify({ status: status, approver_id: user }); 
                break;
            case 'issued':
                req_body = JSON.stringify({ status: status, issued_date: dayjs().format("YYYY-MM-DD")});
                break;
            case 'returned':
                req_body = JSON.stringify({ status: status, returned_date: dayjs().format("YYYY-MM-DD")});
                break;
            default:
                req_body = JSON.stringify({ status: status });
                break;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/selp/lending/update/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: req_body, 
            });
            
            if (response.ok) {
                setStatusMessage(`Request successfully updated to ${status}.`);
                fetchRequests(); // Re-fetch updated list
            } else {
                const error = await response.text();
                setStatusMessage(`Error updating request: ${error || response.statusText}`);
            }
        } catch (err) {
            console.error("Update status error:", err);
            setStatusMessage(`Error: Failed to connect to API or update request. ${err.message}`);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Function to handle the change in the selected status chip
    const handleStatusFilterChange = (status) => {
        setSelectedStatusFilter(status);
    };

    // --- Filtering Logic ---
    const filteredLending = React.useMemo(() => {
        return lending.filter(req => {
            // 1. Requester Name Filter (case-insensitive)
            const matchesRequester = req.requester_name.toLowerCase().includes(searchTerm.toLowerCase());

            // 2. Status Chip Filter
            // Matches if filter is 'all', or if request status matches the selected filter
            const matchesStatus = selectedStatusFilter === 'all' || req.status === selectedStatusFilter;

            return matchesRequester && matchesStatus;
        });
    }, [lending, searchTerm, selectedStatusFilter]);
    // -----------------------

    const StatusBadge = ({ status }) => (
        <Box 
            sx={{
                display: 'inline-block',
                p: '4px 10px',
                borderRadius: '16px', 
                bgcolor: getStatusColor(status),
                color: 'white',
                fontWeight: 'medium',
                minWidth: '80px',
                textAlign: 'center',
                textTransform: 'capitalize',
            }}
        >
            {status}
        </Box>
    );

    const renderActionButtons = (req) => {
        const buttonProps = {
            variant: "contained",
            size: "small",
            sx: { borderRadius: 1, minWidth: '100px' }
        };

        switch (req.status) {
            case 'new':
                return (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                            {...buttonProps}
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={() => handleUpdateStatus(req.id, 'approved')}
                        >
                            Approve
                        </Button>
                        <Button
                            {...buttonProps}
                            color="error"
                            startIcon={<ClearIcon />}
                            onClick={() => handleUpdateStatus(req.id, 'rejected')}
                        >
                            Reject
                        </Button>
                    </Box>
                );
            case 'approved':
                return (
                    <Button
                        {...buttonProps}
                        color="primary" 
                        startIcon={<SendIcon />}
                        onClick={() => handleUpdateStatus(req.id, 'issued')}
                    >
                        Issue Item
                    </Button>
                );
            case 'issued':
                return (
                    <Button
                        {...buttonProps}
                        color="warning" 
                        startIcon={<KeyboardReturnIcon />}
                        onClick={() => handleUpdateStatus(req.id, 'returned')}
                    >
                        Return
                    </Button>
                );
            default:
                return (
                    <Typography variant="caption" color="textSecondary">
                        No Action
                    </Typography>
                );
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
                    pb: 1,
                    borderBottom: '2px solid',
                    borderColor: 'grey.300'
                }}
            >
                Equipment Lending Approval Portal
            </Typography>
            
            {/* --- FILTER CONTROLS --- */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    gap: 3, 
                    mb: 3, 
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' }
                }}
            >
                <TextField
                    label="Search Requester Name"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '250px' } }}
                />

                {/* Status Filter Chips */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1, display: { xs: 'none', md: 'block' } }}>
                        Filter Status:
                    </Typography>
                    {['all', ...ALL_STATUSES].map((status) => (
                        <Chip
                            key={status}
                            label={status === 'all' ? 'All Requests' : status.charAt(0).toUpperCase() + status.slice(1)}
                            variant={selectedStatusFilter === status ? 'filled' : 'outlined'}
                            color={selectedStatusFilter === status ? 'primary' : 'default'}
                            onClick={() => handleStatusFilterChange(status)}
                            sx={{ textTransform: 'capitalize' }}
                        />
                    ))}
                </Box>
            </Box>
            {/* --------------------------- */}


            <Card elevation={5} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 700 }} aria-label="Lending Request Table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Requester</StyledTableCell>
                                    <StyledTableCell>Item Name</StyledTableCell>
                                    <StyledTableCell align="center">Category</StyledTableCell>
                                    <StyledTableCell align="center">Quantity</StyledTableCell>
                                    <StyledTableCell align="center">Purpose</StyledTableCell>
                                     <StyledTableCell align="center">Status</StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Use filteredLending for rendering */}
                                {filteredLending.map((req, index) => (
                                    <StyledTableRow key={req.id || index}>
                                        <StyledTableCell align="left">{req.requester_name}</StyledTableCell>
                                        <StyledTableCell align="left">{req.item_name}</StyledTableCell>
                                        <StyledTableCell align="center">{req.item_category}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {req.quantity}
                                        </StyledTableCell>
                                         <StyledTableCell align="center">{req.purpose}</StyledTableCell>
                                         <StyledTableCell align="center">
                                            <StatusBadge status={req.status} />
                                         </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {renderActionButtons(req)}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                {/* Display a row if the filtered list is empty */}
                                {filteredLending.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            No requests match the current filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Alert for user feedback */}
            {statusMessage && (
                <Alert 
                    severity={statusMessage.startsWith("Error") ? 'error' : 'info'} 
                    sx={{ mt: 3, borderRadius: 2 }}
                >
                    {statusMessage}
                </Alert>
            )}
        </Container>
    );
}

export default ApproveRequest;