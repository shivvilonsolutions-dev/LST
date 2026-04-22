import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Chip,
  Typography,
  Box,
  Switch
} from "@mui/material";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import Popup from "../../../components/ui/Popup";

const ShowQuotations = ({ data }) => {
  const { quotations, setQuotations } = useContext(QuotationContext);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const rowsPerPage = 5;
  const navi = useNavigate()

  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  console.log(quotations)

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleClick = (quotId) => {
    const updated = quotations.map((item) =>
      item.id === quotId
        ? { ...item, status: item.status === "PENDING" ? "CONFIRM" : "PENDING"}
        : item
    );

    setQuotations(updated)
    selectedId(null)
  };

  const handleConfirm = () => {
    const updated = quotations.map((item) =>
      item.id === selectedId
        ? { ...item, status: "CONFIRM" }
        : item
    );

    setQuotations(updated);
    setShowPopup(false);
    setSelectedId(null);
  };

  const handleDelete = (deleteId) => {
    const updated = quotations.filter((item) =>
      item.id !== deleteId
    )

    setQuotations(updated)
    setShowPopup(false)
    setSelectedId(null)
  }

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>

      <TableContainer>
        <Table>

          {/* HEADER */}
          <TableHead sx={{ bgcolor: "#f2f4f5", borderBottom: "2px solid gray" }}>
            <TableRow hover >
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Thickness</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status Update</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>

          {/* BODY */}
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow
                  key={item.id}
                  hover
                >

                  {/* Index */}
                  <TableCell>{index + 1}</TableCell>

                  {/* Name */}
                  <TableCell>{item.cliName}</TableCell>

                  {/* Thickness */}
                  <TableCell>{item.materials[0].gej}</TableCell>

                  {/* Amount */}
                  <TableCell>₹ {item.amount}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                        label={item.status}
                        color={
                          item.status === "CONFIRM"
                            ? "success"
                            : "warning"
                        }
                        onClick={() => {
                          handleClick(item.id)
                        }}
                        size="small"
                        sx={{ marginRight: "15px" }}
                      />
                      
                  </TableCell>

                  {/* Edit */}
                  <TableCell>
                    <Typography
                      sx={{
                        color: "blue",
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() => {
                        navi(`/quotations/${item.id}`)
                      }}
                    >
                      Edit
                    </Typography>
                  </TableCell>

                  {/* Delete */}
                  <TableCell>
                    <Typography
                      sx={{
                        color: "red",
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() => {
                        setSelectedId(item.id);
                        setShowPopup(true)
                      }}
                    >
                      Delete
                    </Typography>
                  </TableCell>

                  {/* View */}
                  <TableCell>
                    <Typography
                      sx={{
                        color: "primary.main",
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() =>
                        navigate(`/quotations/${item.id}`)
                      }
                    >
                      View Detail →
                    </Typography>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Quotations Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
      />

      {/* Popup Confirm Quotation */}
      <Popup
        isOpen={showPopup}
        title="Confirm Quotation"
        message="Are you sure you want to confirm this quotation?"
        onConfirm={handleConfirm}
        onCancel={() => {
          setShowPopup(false);
          setSelectedId(null);
        }}
      />

      {/* Popup Delete Quotation */}
      <Popup
        isOpen={showPopup}
        title="Delete Quotation"
        message="Are you sure you want to delete this quotation?"
        onConfirm={() => {
          handleDelete(selectedId)
        }}
        onCancel={() => {
          setShowPopup(false);
          setSelectedId(null);
        }}
      />

    </Paper>
  );
};

export default ShowQuotations;