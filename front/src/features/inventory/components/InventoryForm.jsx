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
  Select,
  MenuItem,
} from "@mui/material";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Popup from "../../../components/ui/Popup";

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import getCurrentDateTime from '../../../utils/getCurrentDateAndTime'
import { InventoryContext } from "../../../contexts/inventory/inventoryContext"

const InventoryForm = () => {
  const navi = useNavigate()
  const [showPopup, setShowPopup] = useState(false);
  const [existPopup, setExistPopup] = useState(false)
  const [time, setTime] = useState(getCurrentDateTime());
  const { inventories, setInventories } = useContext(InventoryContext);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState(() => ({
    inventoryName: "",
    properties: [
      {
        id: Date.now(), // ✅ runs only ONCE
        thickness: "",
        weight: "",
        height: "",
        lengthOfInventory: ""
      }
    ],
    category: "",
    quantity: "",
    minQuantity: "",
    dateOfInventory: "",
    status: "NORMAL",
  }));

  const inventoryNames = [
    ...new Set(inventories.map((inv) => inv.inventoryName))
  ];

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

    const newProperty = {
      id: Date.now(),
      thickness: formData.properties.thickness,
      dateOfProperty: getCurrentDateTime(),
      weight: formData.properties.weight,
      height: formData.properties.height,
      lengthOfInventory: formData.properties.lengthOfInventory,
      quantity: Number(formData.quantity),
      minQuantity:
        formData.minQuantity === ""
          ? Math.ceil(Number(formData.quantity) * 0.2)
          : Number(formData.minQuantity),
    };

    const normalize = (str) => str.trim().toLowerCase();

    const existingIndex = inventories.findIndex(
      (inv) =>
        normalize(inv.inventoryName) ===
        normalize(formData.inventoryName)
    );

    if (existingIndex !== -1) {
      console.log("Updating existing one...")
      const updatedInventories = [...inventories];

      const alreadyExists = updatedInventories[existingIndex].properties.some(
        (p) => p.thickness === newProperty.thickness
      );

      if (alreadyExists) {
        setExistPopup(true);
        return;
      }

      updatedInventories[existingIndex] = {
        ...updatedInventories[existingIndex],
        properties: [
          ...(updatedInventories[existingIndex].properties || []),
          newProperty,
        ],
      };

      setInventories(updatedInventories);
    }
    else {
      const newInventory = {
        id: Date.now(),
        inventoryName: formData.inventoryName,
        category: formData.category,
        dateOfInventory: getCurrentDateTime(),
        properties: [newProperty],
      };

      setInventories([...inventories, newInventory]);
    }

    setShowPopup(true);
  };

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 2,
            flexWrap: { xs: "wrap", md: "nowrap" }
          }}
        >
          {/* Inventory Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              minWidth: { xs: "100%", md: 300 }
            }}
          >
            {/* Label */}
            <Typography sx={{ minWidth: 130 }}>
              Inventory Name:
            </Typography>

            {/* Input Area */}
            {!isNew ? (
              <Select
                size="small"
                value={formData.inventoryName || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "__new__") {
                    setIsNew(true);
                    setFormData({ ...formData, inventoryName: "" });
                  } else {
                    setFormData({ ...formData, inventoryName: value });
                  }
                }}
                displayEmpty
                sx={{ flex: 1, minWidth: { xs: "100%", md: "auto" } }}
                
              >
                <MenuItem value="" disabled>
                  Select Inventory
                </MenuItem>

                <MenuItem value="__new__" sx={{ color: "primary.main" }}>
                  + Add New
                </MenuItem>

                {inventoryNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: 1, // 👈 same as select
                }}
              >
                <Input
                  inpName="inventoryName"
                  inpValue={formData.inventoryName}
                  inpPlaceholder="Enter new inventory"
                  onChange={handleChange}
                  inpWidth="100%"
                />

                <Button
                  btnName="Cancel"
                  btnColor="gray"
                  txtCol="black"
                  btnWidth="auto"
                  onClick={() => { setIsNew(false) }}
                  sx={{
                    whiteSpace: "nowrap",
                    alignSelf: { xs: "flex-start", md: "center" }
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Date */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flex: 1,
              minWidth: { xs: "100%", md: 300 }
            }}
          >
            <Typography sx={{ ml: 1 }}>
              Date:
            </Typography>

            <Box sx={{ width: { xs: "100%", md: 220 } }}>
              <Input inpValue={time} readOnly />
            </Box>
          </Box>

        </Box>

        {/* Main Section */}
        <Typography variant="h5">Properties</Typography>
        <Grid
          container
          spacing={2}
          sx={{
            mt: 2,
            flexDirection: { xs: "column", md: "row" }
          }}
        >
          {/* Properties Section */}
          <Grid item xs={12} md={6} sx={{ width: "45%", display: "flex", flexDirection: "column", gap: "15px" }}>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Thickness:</Typography>
              <Input inpName="thickness" isReq={true} inpValue={formData.properties.thickness} onChange={(e) => handlePropertyChange("thickness", e.target.value)} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Weight:</Typography>
              <Input inpName="weight" inpValue={formData.properties.weight} onChange={(e) => handlePropertyChange("weight", e.target.value)} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Height:</Typography>
              <Input inpName="height" inpValue={formData.properties.height} onChange={(e) => handlePropertyChange("height", e.target.value)} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Length:</Typography>
              <Input inpName="lengthOfInventory" inpValue={formData.properties.lengthOfInventory} onChange={(e) => handlePropertyChange("lengthOfInventory", e.target.value)} />
            </Box>

          </Grid>

          {/* Other Details Section */}
          <Grid item xs={12} md={6} sx={{ width: "45%", display: "flex", flexDirection: "column", gap: "15px" }}>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Quantity:</Typography>
              <Input inpName="quantity" isReq={true} inpValue={formData.quantity} onChange={handleChange} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography>Minimum Quantity:</Typography>
              <Input inpName="minQuantity" inpValue={formData.minQuantity} onChange={handleChange} />
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

        <Popup
          isOpen={existPopup}
          title="Already Exists"
          message="This thickness already exists!"
          onConfirm={() => {
            navi("/inventories/new-inventory");
            setExistPopup(false);
          }}
          onCancel={() => setExistPopup(false)}
        />

      </Box>
    </Paper>
  )
}

export default InventoryForm
