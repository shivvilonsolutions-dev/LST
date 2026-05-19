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
} from "@mui/material";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";
import Popup from "../../../components/ui/Popup";
import { ClientContext } from "../../../contexts/client/clientContext";

const ShowQuotations = ({ data }) => {
  const {
    handleUpdateQuotation,
    handleDeleteQuotation,
  } = useContext(QuotationContext);

  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const rowsPerPage = 4;
  const navi = useNavigate()

  const [showPopup, setShowPopup] = useState(false);
  const [confirmPopUp, setConfirmPopUp] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleConfirm = async () => {

    const updatedStatus =
      selectedItem.status === "PENDING"
        ? "CONFIRM"
        : "PENDING";

    await handleUpdateQuotation(
      selectedItem.quotationNo,
      {
        ...selectedItem,
        status: updatedStatus,
      }
    );

    setConfirmPopUp(false);

    setSelectedItem(null);
  };

  const handleDelete = async (quotationNo) => {

    await handleDeleteQuotation(
      quotationNo
    );

    setShowPopup(false);

    setSelectedId(null);
  };

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
              <TableCell>WhatsApp</TableCell>
              <TableCell>Laser Cutting</TableCell>
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
                  key={item.quotationNo}
                  hover
                >

                  {/* Index */}
                  <TableCell>{index + 1}</TableCell>

                  {/* Name */}
                  <TableCell>{item.cliName}</TableCell>

                  {/* Thickness */}
                  <TableCell>{item.materials[0].gauge}</TableCell>

                  {/* Whatsapp */}
                  <TableCell>{item.whatsapp}</TableCell>

                  {/* Laser Cutting */}
                  <TableCell>{item.laserCutting || "-"}</TableCell>

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
                        setSelectedItem(item);
                        setConfirmPopUp(true);
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
                        navi(`/quotations/${item.quotationNo}`, {
                          state: { from: "/quotations" }
                        });
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
                        setSelectedId(item.quotationNo);
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
                        navigate(
                          `/quotations/${item.quotationNo}`,
                          {
                            state: {
                              from: "/quotations",
                            },
                          }
                        )
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
        isOpen={confirmPopUp}
        title="Update Status"
        message={
          selectedItem?.status === "PENDING"
            ? "Are you sure you want to CONFIRM this quotation?"
            : "Are you sure you want to mark this quotation as PENDING?"
        }
        onConfirm={handleConfirm}
        onCancel={() => {
          setConfirmPopUp(false);
          setSelectedItem(null);
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