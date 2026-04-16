import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Popup from "../../../components/ui/Popup";

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import getCurrentDateTime from '../../../utils/getCurrentDateAndTime'
import {InventoryContext} from "../../../contexts/inventory/inventoryContext"

const InventoryForm = () => {
  const navi = useNavigate()
  const [showPopup, setShowPopup] = useState(false);
  const [time, setTime] = useState(getCurrentDateTime());
  const { inventories, setInventories } = useContext(InventoryContext);

  const [formData, setFormData] = useState({
    inventoryName: "",
    properties: {
      thickness: "",
      weight: "",
      height: "",
      lengthOfInventory: ""
    },
    category: "",
    quantity: "",
    minQuantity: "",
    dateOfInventory: "",
    status: "NORMAL",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentDateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePropertyChange = (field, value) => {

    const updatedProperties = {
      ...formData.properties,
      [field]: value,
    };

    setFormData({
      ...formData,
      properties: updatedProperties,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const newInventory = {
      ...formData,
      id: Date.now(),
      dateOfInventory: getCurrentDateTime(),
      minQuantity: formData.minQuantity == "" 
        ? Math.ceil(Number(formData.quantity) * 0.2)
        : Number(formData.minQuantity),
    };

    setInventories([...inventories, newInventory])
    setShowPopup(true)

    console.log("Handled the submit data", newInventory)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid gray.300",
        borderRadius: 1,
        bgcolor: "white",
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>

        {/* Top Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            pb: 2,
            borderBottom: "1px solid #e2e8f0",
          }}
        >

          {/* LEFT: Back */}
          <Button
            btnName="← Back"
            btnColor="gray"
            txtCol="black"
            onClick={() => navi("/inventories")}
          />

          {/* RIGHT: Actions */}
          <Stack direction="row" spacing={1.5}>

            <Button
              btnName="Add Inventory →"
              btnType="submit"
              btnColor="secondary.main"
            />

          </Stack>

        </Box>


        {/* Inventory + Time */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "specify-around", alignItems: "center", mb: 2 }}>

          <Typography sx={{ minWidth: 95 }}>Inventory Name:</Typography>
          <Input inpName="inventoryName" isReq={true} inpValue={formData.inventoryName} inpPlaceholder="Enter Inventory Name" onChange={handleChange} />

          <Typography>Date:</Typography>
          <Input inpValue={time} readOnly sx={{ width: 20 }} />

        </Box>

        {/* Main Section */}
        <Typography variant="h5">Properties</Typography>

        <Grid container spacing={3} sx={{marginTop: "20px", justifyContent: "space-between"}}>

          {/* Properties Section */}
          <Grid item xs={12} md={6} sx={{ width: "45%", display: "flex", flexDirection: "column", gap: "15px"}}>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Thickness(in mm):</Typography>
              <Input inpName="thickness" isReq={true} inpValue={formData.properties.thickness} onChange={(e) => handlePropertyChange("thickness", e.target.value)} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Weight(in kg):</Typography>
              <Input inpName="weight" inpValue={formData.properties.weight} onChange={(e) => handlePropertyChange("weight", e.target.value)} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Height(in m):</Typography>
              <Input inpName="height" inpValue={formData.properties.height} onChange={(e) => handlePropertyChange("height", e.target.value)} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Length(in m):</Typography>
              <Input inpName="lengthOfInventory" inpValue={formData.properties.lengthOfInventory} onChange={(e) => handlePropertyChange("lengthOfInventory", e.target.value)} />
            </Box>

          </Grid>

          {/* Other Details Section */}
          <Grid item xs={12} md={6} sx={{ width: "45%", display: "flex", flexDirection: "column", gap: "15px"}}>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Quantity:</Typography>
              <Input inpName="quantity" isReq={true} inpValue={formData.quantity} onChange={handleChange} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Minimum Quantity:</Typography>
              <Input inpName="minQuantity" inpValue={formData.minQuantity} onChange={handleChange} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Category:</Typography>
              <Input inpName="category" inpValue={formData.category} onChange={handleChange} />
            </Box>

          </Grid>

        </Grid>

        {/* Popup */}
        <Popup
          isOpen={showPopup}
          title="Confirm Action"
          message="Are you sure to add this inventory"
          onConfirm={() => {
            navi("/inventories");
            setShowPopup(false);
          }}
          onCancel={() => setShowPopup(false)}
        />

      </Box>
    </Paper>
  )
}

export default InventoryForm
