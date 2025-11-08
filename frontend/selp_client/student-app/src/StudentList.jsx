import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useAuth } from '/src/App';


// --- App Component (Main Export) ---
function StudentList() {
  const [userRequests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [orderBy, setOrderBy] = useState('from_date');
  const [orderDir, setOrderDir] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { user, username } = useAuth();


  useEffect(() => {
    fetchRequests();
  }, []);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
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

  const fetchRequests = async () => {
    try{
        const queryParams = new URLSearchParams();
        queryParams.append('requester', user);
      const resp = await fetch(`http://127.0.0.1:8000/selp/lending/requests/?${queryParams.toString()}`);
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const data = await resp.json();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.error("API response was not an array:", data); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCancel = async (reqId) => {
    const ok = window.confirm('Cancel this request?');
    if (!ok) return;
    try {
      const resp = await fetch(`http://127.0.0.1:8000/selp/lending/requests/${reqId}/`, { method: 'DELETE' });
      if (!resp.ok && resp.status !== 204) {
        console.warn('Cancel returned', resp.status);
      }
    } catch (err) {
      console.warn('Cancel request failed', err);
    }
    setRequests((prev) => prev.filter(r => r.id !== reqId));
  };

  const handleSort = (col) => {
    if (orderBy === col) setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
    else { setOrderBy(col); setOrderDir('asc'); }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = userRequests.slice();
    if (q) {
      arr = arr.filter(r => (r.item_name || '').toLowerCase().includes(q) || (r.status || '').toLowerCase().includes(q));
    }
    arr.sort((a,b) => {
      const va = (a[orderBy] || '')?.toString().toLowerCase();
      const vb = (b[orderBy] || '')?.toString().toLowerCase();
      if (va < vb) return orderDir === 'asc' ? -1 : 1;
      if (va > vb) return orderDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [userRequests, query, orderBy, orderDir]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value,10)); setPage(0); };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
            Request List for User: {username}
        </Typography>

        <Card elevation={3} sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems="center" justifyContent="space-between">
              <TextField size="small" placeholder="Search requests (item name, status)" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ minWidth: 260 }} />
              <div />
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={5}>
            <CardContent>
                {loading ? (
                  <Typography sx={{p:2}} color="text.secondary">Loading requests…</Typography>
                ) : !filtered.length ? (
                  <Typography sx={{p:2}} color="text.secondary">No requests found.</Typography>
                ) : (
                <>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="student requests table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{minWidth:180}}>
                              <TableSortLabel sx={{color: 'white', whiteSpace: 'nowrap', '& .MuiTableSortLabel-icon': { color: 'white' }}} active={orderBy==='item_name'} direction={orderBy==='item_name'?orderDir:'asc'} onClick={() => handleSort('item_name')}><span style={{color:'white', whiteSpace:'nowrap'}}>Item Name</span></TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{minWidth:120}}>
                              <TableSortLabel sx={{color: 'white', whiteSpace: 'nowrap', '& .MuiTableSortLabel-icon': { color: 'white' }}} active={orderBy==='item_category'} direction={orderBy==='item_category'?orderDir:'asc'} onClick={() => handleSort('item_category')}><span style={{color:'white', whiteSpace:'nowrap'}}>Category</span></TableSortLabel>
                            </StyledTableCell>
                              <StyledTableCell align="center">Condition</StyledTableCell>
                              <StyledTableCell align="center">Quantity</StyledTableCell>
                              <StyledTableCell align="center" sx={{minWidth:140}}>
                                <TableSortLabel sx={{color: 'white', whiteSpace: 'nowrap', '& .MuiTableSortLabel-icon': { color: 'white' }}} active={orderBy==='from_date'} direction={orderBy==='from_date'?orderDir:'asc'} onClick={() => handleSort('from_date')}><span style={{color:'white', whiteSpace:'nowrap'}}>From</span></TableSortLabel>
                              </StyledTableCell>
                              <StyledTableCell align="center" sx={{minWidth:140}}>
                                <TableSortLabel sx={{color: 'white', whiteSpace: 'nowrap', '& .MuiTableSortLabel-icon': { color: 'white' }}} active={orderBy==='to_date'} direction={orderBy==='to_date'?orderDir:'asc'} onClick={() => handleSort('to_date')}><span style={{color:'white', whiteSpace:'nowrap'}}>To</span></TableSortLabel>
                              </StyledTableCell>
                            <StyledTableCell align="right">Status</StyledTableCell>
                            <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage).map((req) => (
                            <StyledTableRow key={req.id}>
                                <StyledTableCell align="left">{req.item_name}</StyledTableCell>
                                <StyledTableCell align="center">{req.item_category}</StyledTableCell>
                                <StyledTableCell align="center">{req.item_condition}</StyledTableCell>
                                <StyledTableCell align="right">{req.quantity}</StyledTableCell>
                                <StyledTableCell align="right">{req.from_date ? dayjs(req.from_date).format('DD-MMM-YYYY') : '-'}</StyledTableCell>
                                <StyledTableCell align="right">{req.to_date ? dayjs(req.to_date).format('DD-MMM-YYYY') : '-'}</StyledTableCell>
                                <StyledTableCell align="right">
                                  <Chip label={req.status} color={req.status?.toLowerCase()==='approved'? 'success' : req.status?.toLowerCase()==='rejected'? 'error' : 'warning'} size="small" />
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    {req.status?.toLowerCase()==='pending' ? (
                                      <Button size="small" color="error" variant="outlined" onClick={() => handleRequestCancel(req.id)}>Cancel</Button>
                                    ) : (
                                      <Button size="small" variant="outlined" disabled>Cancel</Button>
                                    )}
                                  </Stack>
                                </StyledTableCell>
                            </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination component="div" count={filtered.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5,10,25]} />
                </>
                )}
            </CardContent>
        </Card>
        </Container>
  );
}

export default StudentList;