import { useEffect, useState } from 'react'
import './App.css'
import * as React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';



// --- App Component (Main Export) ---
function ItemAdd() {

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [condition, setCondition] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [availability, setAvailability] = useState(0)

    const [result, setResult] = useState("");

    const categories = [
        ('sports'),
        ('lab'),
        ('cameras'),
        ('musical'),
        ('project'),
    ]
    
    const condition_type = [
        ('New'),
        ('Good'),
        ('Fair'),
        ('Broken'),
    ]

    const addItem = async () => {
      if (quantity < availability){

      }
      const itemData = {
        name,
        category,
        condition,
        quantity,
        availability
      }
      try {
      const response = await fetch("http://localhost:8000/selp/equipment/items/create", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setResult(`Item "${name}" added successfully!`);

      setName("");
      setCategory("");
      setCondition("");
      setQuantity(0);
      setAvailability(0);
      //setResult("");
      //setItems ((prev) => [...prev, data]);
    } catch (err) {
      console.log(err);
      setResult(`Error: Failed to add item. ${err.message}`)
    } 

  };
  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Add New Item
        </Typography>

        <Card raised>
          <CardContent>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                label="Item Name" 
                variant="outlined" 
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <FormControl fullWidth variant="outlined" required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((catid) => (
                    <MenuItem key={catid} value={catid}>
                      {catid}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth variant="outlined" required>
                <InputLabel id="condition-label">Condition</InputLabel>
                <Select
                  labelId="condition-label"
                  id="condition-select"
                  value={condition}
                  label="Condition"
                  onChange={(e) => setCondition(e.target.value)}
                >
                  {condition_type.map((condid) => (
                    <MenuItem key={condid} value={condid}>
                      {condid}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  label="Total Quantity" 
                  type="number" 
                  variant="outlined" 
                  fullWidth
                  value={quantity} inputProps={{ min: 1 }}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
                
                <TextField 
                  label="Currently Available" 
                  type="number" 
                  variant="outlined" 
                  fullWidth
                  value={availability} inputProps={{ min: 1 }}
                  onChange={(e) => setAvailability(e.target.value)}
                />
              </Box>
            </Box>
            {result && (
                <Typography 
                    variant="body2" 
                    sx={{ mt: 2, color: result.startsWith("Error") ? 'error.main' : 'primary.main' }}
                >
                    {result}
                </Typography>
            )}
          </CardContent>
          
          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={addItem}
            >
              Add Item to Inventory
            </Button>
          </CardActions>
        </Card>
      </Container>

      </>
  );
}

export default ItemAdd;

