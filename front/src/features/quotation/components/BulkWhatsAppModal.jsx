import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  Button as MuiButton,
  Chip,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const DEFAULT_TEMPLATES = [
  {
    label: "Quotation Follow-up",
    text: "Hello {name}, regarding your quotation for {thickness}, please let us know if you would like to proceed. Thank you - LST",
  },
  {
    label: "Material Ready",
    text: "Hello {name}, your material for {thickness} is ready for delivery. Kindly confirm. Thank you - LST",
  },
  {
    label: "Rate Update",
    text: "Hello {name}, here is an update regarding the rates for {thickness}. Please contact us for details - LST",
  },
];

const BulkWhatsAppModal = ({ open, onClose, data = [], searchQuery = "" }) => {
  // Extract unique clients from filtered quotations
  const clients = useMemo(() => {
    const map = new Map();
    (data || []).forEach((item) => {
      if (!item) return;
      const rawPhone = String(item.whatsapp || item.mobile || "").replace(/\D/g, "");
      const phone10 = rawPhone.slice(-10);
      if (!phone10 || phone10.length < 10) return;

      const gaugeList = (item.materials || [])
        .map((m) => m.gauge)
        .filter(Boolean)
        .join(", ");

      if (!map.has(phone10)) {
        map.set(phone10, {
          cliName: item.cliName || "Customer",
          phone: phone10,
          rawPhone: item.whatsapp || item.mobile,
          thicknesses: gaugeList ? [gaugeList] : [],
        });
      } else {
        const existing = map.get(phone10);
        if (gaugeList && !existing.thicknesses.includes(gaugeList)) {
          existing.thicknesses.push(gaugeList);
        }
      }
    });

    return Array.from(map.values()).map((c) => ({
      ...c,
      thickness: c.thicknesses.filter(Boolean).join(", ") || searchQuery || "-",
    }));
  }, [data, searchQuery]);

  // Selected clients state
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [message, setMessage] = useState(DEFAULT_TEMPLATES[0].text);
  const [sentMap, setSentMap] = useState({});
  const [copiedType, setCopiedType] = useState("");

  // When modal opens, select all by default and reset sent map
  useEffect(() => {
    if (open) {
      setSelectedPhones(clients.map((c) => c.phone));
      setSentMap({});
      setCopiedType("");
    }
  }, [open]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPhones(clients.map((c) => c.phone));
    } else {
      setSelectedPhones([]);
    }
  };

  const handleToggleOne = (phone) => {
    setSelectedPhones((prev) =>
      prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone]
    );
  };

  // Insert tag at cursor position
  const handleInsertTag = (tag) => {
    setMessage((prev) => `${prev} ${tag} `);
  };

  // Helper to build personalized message for a client
  const buildPersonalizedMessage = (client) => {
    return message
      .replace(/\{name\}/gi, client.cliName || "Customer")
      .replace(/\{thickness\}/gi, client.thickness || searchQuery || "")
      .trim();
  };

  // Send single WhatsApp message
  const handleSendToClient = async (client) => {
    const text = buildPersonalizedMessage(client);
    const whatsappUrl = `https://web.whatsapp.com/send?phone=91${client.phone}&text=${encodeURIComponent(text)}`;

    try {
      if (window.electronAPI?.openExternal) {
        // Electron environment - open in system default browser (Chrome/Edge)
        await window.electronAPI.openExternal(whatsappUrl);
      } else {
        // Browser environment
        window.open(whatsappUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to open WhatsApp URL:", err);
      try {
        window.open(whatsappUrl, "_blank");
      } catch (fallbackErr) {
        console.error("Browser fallback error:", fallbackErr);
      }
    } finally {
      setSentMap((prev) => ({ ...prev, [client.phone]: true }));
    }
  };

  // Send next pending client in queue
  const handleSendNext = () => {
    const nextClient = clients.find(
      (c) => selectedPhones.includes(c.phone) && !sentMap[c.phone]
    );
    if (nextClient) {
      handleSendToClient(nextClient);
    }
  };

  // Copy all phone numbers to clipboard
  const handleCopyNumbers = () => {
    const numbers = clients
      .filter((c) => selectedPhones.includes(c.phone))
      .map((c) => c.phone)
      .join(", ");

    navigator.clipboard.writeText(numbers);
    setCopiedType("numbers");
    setTimeout(() => setCopiedType(""), 2500);
  };

  // Copy drafted message
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopiedType("message");
    setTimeout(() => setCopiedType(""), 2500);
  };

  const selectedCount = selectedPhones.length;
  const sentCount = Object.keys(sentMap).filter((p) => selectedPhones.includes(p)).length;
  const sampleClient = clients.find((c) => selectedPhones.includes(c.phone)) || clients[0];
  const previewText = sampleClient ? buildPersonalizedMessage(sampleClient) : "";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Title */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#f0fdf4",
          borderBottom: "1px solid #bbf7d0",
          py: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WhatsAppIcon sx={{ color: "#25D366", fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#166534" }}>
              Send Customised WhatsApp Message
            </Typography>
            <Typography variant="caption" sx={{ color: "#15803d" }}>
              {searchQuery ? `Filtered by "${searchQuery}" • ` : ""}
              {clients.length} unique clients found ({selectedCount} selected)
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* TOP: Message drafting & template chips */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
              Custom Message:
            </Typography>

            {/* Clickable Tags */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Insert Tag:
              </Typography>
              <Chip
                label="{name}"
                size="small"
                onClick={() => handleInsertTag("{name}")}
                sx={{
                  bgcolor: "#dbeafe",
                  color: "#1e40af",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              />
              <Chip
                label="{thickness}"
                size="small"
                onClick={() => handleInsertTag("{thickness}")}
                sx={{
                  bgcolor: "#fef3c7",
                  color: "#92400e",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              />
            </Stack>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here... Use {name} for client name and {thickness} for thickness/gauge"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#ffffff",
                borderRadius: 1.5,
              },
            }}
          />

          {/* Quick Template Chips */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, flexWrap: "wrap" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Quick Templates:
            </Typography>
            {DEFAULT_TEMPLATES.map((tmpl, idx) => (
              <Chip
                key={idx}
                label={tmpl.label}
                size="small"
                variant={message === tmpl.text ? "filled" : "outlined"}
                color="success"
                onClick={() => setMessage(tmpl.text)}
                sx={{ cursor: "pointer", fontSize: "11px" }}
              />
            ))}
          </Box>
        </Box>

        {/* PREVIEW BOX */}
        {sampleClient && (
          <Box
            sx={{
              bgcolor: "#f8fafc",
              border: "1px dashed #cbd5e1",
              borderRadius: 1.5,
              p: 1.5,
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, display: "block", mb: 0.5 }}>
              Message Preview (for {sampleClient.cliName}):
            </Typography>
            <Typography
              variant="body2"
              sx={{
                bgcolor: "#e2f7cb",
                p: 1.2,
                borderRadius: 1.5,
                color: "#111827",
                display: "inline-block",
                maxWidth: "100%",
                whiteSpace: "pre-wrap",
                fontSize: "13px",
              }}
            >
              {previewText || "(Type a message above)"}
            </Typography>
          </Box>
        )}

        <Divider />

        {/* BOTTOM: Recipient list table */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
              Recipients ({selectedCount} of {clients.length} selected):
            </Typography>

            <Stack direction="row" spacing={1}>
              <MuiButton
                size="small"
                startIcon={<ContentCopyIcon fontSize="small" />}
                onClick={handleCopyNumbers}
                disabled={selectedCount === 0}
                sx={{ textTransform: "none", fontSize: "12px", color: "#475569" }}
              >
                {copiedType === "numbers" ? "Numbers Copied! ✓" : "Copy Numbers"}
              </MuiButton>
              <MuiButton
                size="small"
                startIcon={<ContentCopyIcon fontSize="small" />}
                onClick={handleCopyMessage}
                sx={{ textTransform: "none", fontSize: "12px", color: "#475569" }}
              >
                {copiedType === "message" ? "Message Copied! ✓" : "Copy Message"}
              </MuiButton>
            </Stack>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              maxHeight: 240,
              border: "1px solid #e2e8f0",
              borderRadius: 1.5,
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ "& th": { bgcolor: "#f8fafc", fontWeight: 700 } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selectedCount === clients.length && clients.length > 0}
                      indeterminate={selectedCount > 0 && selectedCount < clients.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Thickness / Gauge</TableCell>
                  <TableCell>WhatsApp No.</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.length > 0 ? (
                  clients.map((client) => {
                    const isSelected = selectedPhones.includes(client.phone);
                    const isSent = !!sentMap[client.phone];

                    return (
                      <TableRow
                        key={client.phone}
                        hover
                        sx={{ bgcolor: isSent ? "#f0fdf4" : "inherit" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            checked={isSelected}
                            onChange={() => handleToggleOne(client.phone)}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{client.cliName}</TableCell>
                        <TableCell>{client.thickness}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell align="center">
                          {isSent ? (
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
                              label="Sent"
                              size="small"
                              color="success"
                              sx={{ height: 22, fontSize: "11px" }}
                            />
                          ) : (
                            <Chip
                              label="Pending"
                              size="small"
                              variant="outlined"
                              sx={{ height: 22, fontSize: "11px", color: "#64748b" }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <MuiButton
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
                            onClick={() => handleSendToClient(client)}
                            sx={{
                              textTransform: "none",
                              fontSize: "12px",
                              py: 0.3,
                              px: 1,
                              bgcolor: "#25D366",
                              "&:hover": { bgcolor: "#1ebd5a" },
                            }}
                          >
                            Send
                          </MuiButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No clients found with valid phone numbers in this filtered list.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* WhatsApp Ban Safety Tip */}
          <Box
            sx={{
              mt: 1.5,
              bgcolor: "#fffbeb",
              border: "1px solid #fef3c7",
              borderRadius: 1.5,
              p: 1.2,
            }}
          >
            <Typography variant="caption" sx={{ color: "#92400e", fontSize: "11.5px", display: "block" }}>
              💡 <strong>WhatsApp Ban Protection:</strong> Har message bhejte waqt 5-10 second ka gap rakhein. Ek din me 40-50 se zyada bulk follow-ups na karein. Client ka naam {"{name}"} aur requirement {"{thickness}"} hone se WhatsApp spam filter trigger nahi hota.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions
        sx={{
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          px: 2.5,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Progress: <strong>{sentCount}</strong> / {selectedCount} sent
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <MuiButton
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: "none", color: "#64748b", borderColor: "#cbd5e1" }}
          >
            Close
          </MuiButton>

          {/* Send Next button */}
          <MuiButton
            variant="contained"
            color="success"
            startIcon={<SendIcon />}
            onClick={handleSendNext}
            disabled={selectedCount === 0 || sentCount >= selectedCount}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#25D366",
              "&:hover": { bgcolor: "#1ebd5a" },
            }}
          >
            {sentCount === 0
              ? "Start Sending (1 by 1)"
              : `Send Next (${selectedCount - sentCount} left)`}
          </MuiButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default BulkWhatsAppModal;
