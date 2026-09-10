import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button as MuiButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  IconButton,
  Alert,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockResetIcon from "@mui/icons-material/LockReset";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import GroupIcon from "@mui/icons-material/Group";
import StorageIcon from "@mui/icons-material/Storage";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";

import { getAllUsersApi, createUser, deleteUserApi } from "../api/authApi";
import api from "../api/axios";
import { AuthContext } from "../contexts/auth/AuthContext";
import Popup from "../components/ui/Popup";

const SuperAdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isSuperAdmin =
    !user ||
    user.role === "SUPER_ADMIN" ||
    user.userId === "ADMIN001" ||
    user.email === "odedraarjun928@gmail.com" ||
    user.email === "admin@gmail.com";

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  // Form states
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [editAdmin, setEditAdmin] = useState({ userId: "", name: "", email: "", password: "" });

  const [popup, setPopup] = useState({ open: false, title: "", message: "" });

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAllUsersApi();
    if (res && res.users) {
      setUsersList(res.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const res = await createUser({ ...newAdmin, role: "ADMIN" });
    if (res.success) {
      setOpenCreateModal(false);
      setNewAdmin({ name: "", email: "", password: "" });
      setPopup({ open: true, title: "Success", message: "New Admin account created successfully!" });
      fetchUsers();
    } else {
      setPopup({ open: true, title: "Error", message: res.message || "Failed to create admin" });
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/auth/users/${editAdmin.userId}`, {
        name: editAdmin.name,
        email: editAdmin.email,
        password: editAdmin.password,
      });

      if (res.data && res.data.success) {
        setOpenEditModal(false);
        setPopup({ open: true, title: "Success", message: "Admin details / password updated successfully!" });
        fetchUsers();
      } else {
        setPopup({ open: true, title: "Error", message: res.data?.message || "Failed to update" });
      }
    } catch (err) {
      setPopup({ open: true, title: "Error", message: err.response?.data?.message || "Update failed" });
    }
  };

  const handleDeleteUser = async (targetUserId) => {
    if (targetUserId === "ADMIN001") {
      setPopup({ open: true, title: "Forbidden", message: "Cannot delete Super Admin account!" });
      return;
    }

    if (window.confirm(`Are you sure you want to delete Admin (${targetUserId})?`)) {
      const res = await deleteUserApi(targetUserId);
      if (res.success) {
        setPopup({ open: true, title: "Deleted", message: "Admin deleted successfully." });
        fetchUsers();
      } else {
        setPopup({ open: true, title: "Error", message: res.message || "Failed to delete" });
      }
    }
  };

  if (!isSuperAdmin) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error">Only Super Admin has access to the Super Admin Control Panel.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <SupervisorAccountIcon color="primary" sx={{ fontSize: 36 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Super Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              System Admin Overview & Account Management
            </Typography>
          </Box>
        </Box>

        <MuiButton
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => setOpenCreateModal(true)}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          Create New Admin
        </MuiButton>
      </Box>

      {/* Summary Stat Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexDirection: { xs: "column", sm: "row" } }}>
        <Card sx={{ flex: 1, bgcolor: "#eef2ff", borderRadius: 3, borderLeft: "5px solid #162660" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Admins / Users
              </Typography>
              <GroupIcon color="primary" />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="primary" sx={{ my: 1 }}>
              {usersList.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active multi-tenant accounts in system
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, bgcolor: "#e6f4ea", borderRadius: 3, borderLeft: "5px solid #137333" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Super Admin Account
              </Typography>
              <SecurityIcon sx={{ color: "#137333" }} />
            </Box>
            <Typography variant="h6" fontWeight="bold" color="#137333" sx={{ my: 1 }}>
              odedraarjun928@gmail.com
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Full System Access Rights
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, bgcolor: "#fef7e0", borderRadius: 3, borderLeft: "5px solid #b06000" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Database Isolation
              </Typography>
              <StorageIcon sx={{ color: "#b06000" }} />
            </Box>
            <Typography variant="h6" fontWeight="bold" color="#b06000" sx={{ my: 1 }}>
              Isolated DB per Admin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Local MongoDB + Cloud Backup
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Admins List Table */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2 }}>
        <Box sx={{ p: 2, bgcolor: "#162660", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            All Registered System Users ({usersList.length})
          </Typography>
        </Box>

        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email / Login ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  No admin users found.
                </TableCell>
              </TableRow>
            ) : (
              usersList.map((u) => (
                <TableRow key={u.userId} hover>
                  <TableCell>
                    <Typography fontWeight="bold" color="primary">
                      {u.userId}
                    </Typography>
                  </TableCell>
                  <TableCell>{u.name || "N/A"}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role || (u.userId === "ADMIN001" ? "SUPER_ADMIN" : "ADMIN")}
                      color={u.role === "SUPER_ADMIN" || u.userId === "ADMIN001" ? "error" : "primary"}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <MuiButton
                      size="small"
                      variant="outlined"
                      startIcon={<LockResetIcon />}
                      onClick={() => {
                        setEditAdmin({ userId: u.userId, name: u.name || "", email: u.email || "", password: "" });
                        setOpenEditModal(true);
                      }}
                      sx={{ mr: 1, borderRadius: 2 }}
                    >
                      Change Password
                    </MuiButton>

                    {u.userId !== "ADMIN001" && (
                      <IconButton color="error" size="small" onClick={() => handleDeleteUser(u.userId)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal: Create New Admin */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>Create New Admin Account</DialogTitle>
        <form onSubmit={handleCreateAdmin}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Admin Name"
                fullWidth
                required
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
              />
              <TextField
                label="Admin Email"
                type="email"
                fullWidth
                required
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <MuiButton onClick={() => setOpenCreateModal(false)}>Cancel</MuiButton>
            <MuiButton type="submit" variant="contained" color="primary">
              Create Admin
            </MuiButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal: Change Password / Edit Admin */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>Change Password for ({editAdmin.userId})</DialogTitle>
        <form onSubmit={handleUpdateAdmin}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Admin Name"
                fullWidth
                value={editAdmin.name}
                onChange={(e) => setEditAdmin({ ...editAdmin, name: e.target.value })}
              />
              <TextField
                label="Admin Email"
                type="email"
                fullWidth
                value={editAdmin.email}
                onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                placeholder="Enter new password"
                value={editAdmin.password}
                onChange={(e) => setEditAdmin({ ...editAdmin, password: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <MuiButton onClick={() => setOpenEditModal(false)}>Cancel</MuiButton>
            <MuiButton type="submit" variant="contained" color="primary">
              Update Password
            </MuiButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Notification Popup */}
      <Popup
        isOpen={popup.open}
        title={popup.title}
        message={popup.message}
        onConfirm={() => setPopup({ open: false, title: "", message: "" })}
        onCancel={() => setPopup({ open: false, title: "", message: "" })}
      />
    </Box>
  );
};

export default SuperAdminPanel;
