import React, { useEffect, useMemo, useState } from 'react';
import ItemCard from './ItemCard';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const ItemList = ({ endpoint = 'http://127.0.0.1:8000/selp/equipment/items/' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid'); // grid or table
  const [orderBy, setOrderBy] = useState('name');
  const [orderDir, setOrderDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    let mounted = true;
    const fetchItems = async () => {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        if (mounted) setItems(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.warn('ItemList fetch failed, using fallback sample', err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchItems();
    return () => { mounted = false; };
  }, [endpoint]);

  const handleChangeView = (event, next) => {
    if (next) setView(next);
  };

  const handleSort = (col) => {
    if (orderBy === col) {
      setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(col);
      setOrderDir('asc');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = items.slice();
    if (q) {
      arr = arr.filter(i => (i.name || '').toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q));
    }
    arr.sort((a, b) => {
      const va = (a[orderBy] || '')?.toString().toLowerCase();
      const vb = (b[orderBy] || '')?.toString().toLowerCase();
      if (va < vb) return orderDir === 'asc' ? -1 : 1;
      if (va > vb) return orderDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [items, query, orderBy, orderDir]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <div className="items-loading">Loading items…</div>;
  if (!items.length) return <div className="items-empty">No items found.</div>;

  return (
    <div className="items-area">
      <div className="items-toolbar">
        <TextField size="small" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or category" />
        <ToggleButtonGroup value={view} exclusive onChange={handleChangeView} size="small" aria-label="view toggle">
          <ToggleButton value="grid">Grid</ToggleButton>
          <ToggleButton value="table">Table</ToggleButton>
        </ToggleButtonGroup>
      </div>

      {view === 'grid' && (
        <section className="items-grid">
          {filtered.map((it) => (
            <ItemCard item={it} key={it.id || it.name} />
          ))}
        </section>
      )}

      {view === 'table' && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>Name</TableCell>
                  <TableCell onClick={() => handleSort('category')} style={{cursor: 'pointer'}}>Category</TableCell>
                  <TableCell onClick={() => handleSort('condition')} style={{cursor: 'pointer'}}>Condition</TableCell>
                  <TableCell onClick={() => handleSort('quantity')} style={{cursor: 'pointer'}}>Quantity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id || row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.condition}</TableCell>
                    <TableCell>{row.quantity ?? row.qty ?? '-'}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => {/* view action placeholder */}}>View</Button>
                      <Button size="small" variant="contained" sx={{ml:1}} onClick={() => {/* request action placeholder */}}>Request</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5,10,25]}
          />
        </Paper>
      )}
    </div>
  );
};

export default ItemList;
