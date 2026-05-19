import React, {
  useContext,
  useState,
} from "react";

import {
  TextField,
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import {
  InventoryContext,
} from "../../contexts/inventory/inventoryContext";

import Button from "../../components/ui/Button";
import Popup from "../../components/ui/Popup";
import ErrorMessage from "../../components/ui/ErrorMessage";
import PageLoader from "../../components/ui/PageLoader";

const InventoryArea = () => {

  const {
    inventories,
    loading,
    error,
    handleDeleteInventory,
  } = useContext(
    InventoryContext
  );

  const [
    showPopUp,
    setShowPopUp,
  ] = useState(false);

  const [page, setPage] =
    useState(0);

  const [
    selectedId,
    setSelectedId,
  ] = useState(null);

  const [search, setSearch] =
    useState("");

  const navi =
    useNavigate();

  const rowsPerPage = 10;

  if (loading) {
    return <PageLoader />;
  }

  const filteredData =
    inventories.filter((item) => {

      const query =
        search.toLowerCase();

      const matchName =
        item.inventoryName
          ?.toLowerCase()
          .includes(query);

      const matchProperties =
        item.properties?.some(
          (prop) =>
            prop.thickness
              ?.toString()
              .toLowerCase()
              .includes(query)
        );

      return (
        matchName ||
        matchProperties
      );
    });

  const paginatedData =
    filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage +
      rowsPerPage
    );

  const handleDelete =
    async (
      inventoryId
    ) => {

      await handleDeleteInventory(
        inventoryId
      );

      setShowPopUp(false);
    };

  return (

    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border:
          "1px solid #e2e8f0",
      }}
    >

      <ErrorMessage
        message={error}
      />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",

          marginBottom:
            "16px",
        }}
      >

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Inventories
        </Typography>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: "15px",
          }}
        >

          <TextField
            size="small"

            placeholder="Search inventory..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <Button
            btnName={
              "+ New inventory"
            }

            btnColor="secondary.main"

            onClick={() =>
              navi(
                "/inventories/new-inventory"
              )
            }
          />

        </Box>

      </Box>

      {/* Table */}
      <Paper
        elevation={2}

        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >

        <TableContainer>

          <Table>

            <TableHead
              sx={{
                bgcolor:
                  "#f2f4f5",

                borderBottom:
                  "2px solid gray",
              }}
            >

              <TableRow hover>

                <TableCell>
                  No
                </TableCell>

                <TableCell>
                  Name
                </TableCell>

                <TableCell>
                  Thickness
                </TableCell>

                <TableCell>
                  Quantity
                </TableCell>

                <TableCell>
                  Delete
                </TableCell>

                <TableCell>
                  Detail
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {paginatedData.length >
                0 ? (

                paginatedData.map(
                  (
                    item,
                    i
                  ) => (

                    <TableRow
                      key={
                        item.inventoryId
                      }
                      hover
                    >

                      <TableCell>
                        {i + 1}
                      </TableCell>

                      <TableCell>
                        {
                          item.inventoryName
                        }
                      </TableCell>

                      <TableCell>
                        {
                          item.properties?.length > 0

                            ? item.properties
                              .map(
                                (prop) =>
                                  prop.thickness
                              )
                              .join(", ")

                            : "-"
                        }
                      </TableCell>

                      <TableCell
                        sx={{
                          fontSize:
                            "18px",
                        }}
                      >
                        {
                          item.properties?.length > 0

                            ? item.properties
                              .map(
                                (prop) =>
                                  prop.quantity
                              )
                              .join(", ")

                            : "-"
                        }
                      </TableCell>

                      {/* DELETE */}
                      <TableCell>

                        <Typography
                          sx={{
                            color:
                              "#f74d6c",

                            cursor:
                              "pointer",

                            "&:hover":
                            {
                              textDecoration:
                                "underline",
                            },
                          }}

                          onClick={() => {

                            setShowPopUp(
                              true
                            );

                            setSelectedId(
                              item.inventoryId
                            );
                          }}
                        >
                          Delete
                        </Typography>

                      </TableCell>

                      {/* DETAIL */}
                      <TableCell>

                        <Typography
                          sx={{
                            color:
                              "primary.main",

                            cursor:
                              "pointer",

                            "&:hover":
                            {
                              textDecoration:
                                "underline",
                            },
                          }}

                          onClick={() =>
                            navi(
                              `/inventories/${item.inventoryId}`
                            )
                          }
                        >
                          View Detail →
                        </Typography>

                      </TableCell>

                    </TableRow>
                  )
                )

              ) : (

                <TableRow>

                  <TableCell
                    colSpan={5}
                    align="center"
                  >
                    No Inventory Data
                  </TableCell>

                </TableRow>
              )}

            </TableBody>

          </Table>

        </TableContainer>

        <TablePagination
          component="div"

          count={
            filteredData.length
          }

          page={page}

          onPageChange={(
            e,
            newPage
          ) =>
            setPage(newPage)
          }

          rowsPerPage={
            rowsPerPage
          }

          rowsPerPageOptions={[
            10,
          ]}
        />

      </Paper>

      {/* DELETE POPUP */}
      <Popup
        isOpen={showPopUp}

        title="Delete Inventory"

        message="Are you sure you want to delete this inventory?"

        onConfirm={() => {
          handleDelete(
            selectedId
          );
        }}

        onCancel={() => {

          setShowPopUp(false);

          setSelectedId(
            null
          );
        }}
      />

    </Paper>
  );
};

export default InventoryArea;