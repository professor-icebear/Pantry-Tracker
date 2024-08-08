'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(true);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const results = inventory.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventory(results);
  }, [searchQuery, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      style={{
        backgroundColor: '#F5DEB3', // Light brownish background
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6" color="#8B4513">Add Item</Typography> {/* SaddleBrown color */}
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button variant="outlined" color="secondary" onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}>Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Add New Item
        </Button>
      </Stack>

      <Box border="1px solid #8B4513"> {/* SaddleBrown color */}
        <Box
          width="800px"
          height="100px"
          bgcolor="#DEB887" // BurlyWood color
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#8B4513">
            Inventory Items
          </Typography>
        </Box>
        <Box 
          width="800px" 
          mt={2} 
          mb={2} 
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ p: 2 }} // Adding padding to center the search bar
        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: 'white', // White background color for the search bar
              borderRadius: 1, // Adding some border-radius to make it look nicer
            }}
          />
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%" // Set width to 100%
              minHeight="75px" // Reduced height by half
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#FFF8DC" // Cornsilk color
              padding={2.5} // Reduced padding by half, adjust if needed
              borderRadius={2} // Adding border radius for rounded corners
            >
              <Typography variant='h5' color='#8B4513' textAlign='center'> {/* Smaller variant */}
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant='h5' color='#8B4513' textAlign='center'> {/* Smaller variant */}
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small" // Smaller button size
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small" // Smaller button size
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
