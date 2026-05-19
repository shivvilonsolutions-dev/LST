import React,
{
  forwardRef,
} from "react";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import formatDate
from "../../../utils/formatDate";


const QuotationPdfTemplate =
  forwardRef(
    ({ data }, ref) => {

      return (

        <Box
          ref={ref}
        >

          {/* MAIN CONTAINER */}
          <Box>

            {/* Client + Date */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mb: 2,
                justifyContent: "specify-around",
              }}
            >

              <Typography
                sx={{
                  minWidth: 95
                }}
              >
                Client Name:
              </Typography>

              <Box
                sx={{
                  flex: 1,
                  border:
                    "1px solid #d1d5db",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center",
                }}
              >

                <Typography>
                  {data?.cliName}
                </Typography>

              </Box>

              <Typography>
                Date:
              </Typography>

              <Box
                sx={{
                  border:
                    "1px solid #d1d5db",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                  minHeight: 40,
                  minWidth: 220,
                  display: "flex",
                  alignItems: "center",
                }}
              >

                <Typography>
                  {formatDate(
                    data?.quotationDate
                  )}
                </Typography>

              </Box>

            </Box>


            {/* MAIN SECTION */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                mt: 3,
                width: "100%",
                alignItems: "center",
              }}
            >

              {/* TABLE */}
              <Box
                sx={{
                  flex: 1
                }}
              >

                <Table
                  sx={{
                    width: "100%",
                    tableLayout: "fixed",

                    "& th, & td": {
                      padding: "3px",
                    },
                  }}
                >

                  <TableHead>

                    <TableRow>

                      <TableCell
                        sx={{
                          width: "5%"
                        }}
                      >
                        No.
                      </TableCell>

                      <TableCell
                        sx={{
                          width: "55%"
                        }}
                      >
                        Size
                      </TableCell>

                      <TableCell
                        sx={{
                          width: "15%"
                        }}
                      >
                        Peice
                      </TableCell>

                      <TableCell
                        sx={{
                          width: "15%"
                        }}
                      >
                        Gauge
                      </TableCell>

                    </TableRow>

                  </TableHead>

                  <TableBody>

                    {data?.materials?.map(
                      (
                        row,
                        i
                      ) => (

                        <TableRow
                          key={i}
                        >

                          <TableCell
                            sx={{
                              p: "3px"
                            }}
                          >
                            {i + 1}
                          </TableCell>

                          <TableCell
                            sx={{
                              p: "3px"
                            }}
                          >

                            <Box
                              sx={{
                                border:
                                  "1px solid #d1d5db",

                                borderRadius: 1,

                                px: 1.5,

                                py: 1,

                                minHeight: 40,

                                display: "flex",

                                alignItems: "center",
                              }}
                            >

                              <Typography>
                                {row.size}
                              </Typography>

                            </Box>

                          </TableCell>

                          <TableCell
                            sx={{
                              p: "3px"
                            }}
                          >

                            <Box
                              sx={{
                                border:
                                  "1px solid #d1d5db",

                                borderRadius: 1,

                                px: 1.5,

                                py: 1,

                                minHeight: 40,

                                display: "flex",

                                alignItems: "center",
                              }}
                            >

                              <Typography>
                                {row.piece}
                              </Typography>

                            </Box>

                          </TableCell>

                          <TableCell
                            sx={{
                              p: "3px"
                            }}
                          >

                            <Box
                              sx={{
                                border:
                                  "1px solid #d1d5db",

                                borderRadius: 1,

                                px: 1.5,

                                py: 1,

                                minHeight: 40,

                                display: "flex",

                                alignItems: "center",
                              }}
                            >

                              <Typography>
                                {row.gauge}
                              </Typography>

                            </Box>

                          </TableCell>

                        </TableRow>
                      )
                    )}

                  </TableBody>

                </Table>

              </Box>


              {/* RIGHT SECTION */}
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >

                {[
                  [
                    "Mobile No.",
                    data?.mobile,
                  ],

                  [
                    "WhatsApp No.",
                    data?.whatsapp,
                  ],

                  [
                    "Rate B1",
                    data?.rateB1,
                  ],

                  [
                    "Rate B2",
                    data?.rateB2,
                  ],

                  [
                    "Bending",
                    data?.bending,
                  ],

                  [
                    "Laser Cutting",
                    data?.laserCutting,
                  ],

                  [
                    "Add",
                    data?.add,
                  ],
                ].map(
                  (
                    item,
                    index
                  ) => (

                    <Box
                      key={index}

                      sx={{
                        display: "flex",

                        flexDirection:
                          "row",

                        gap: "10px",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "center",
                      }}
                    >

                      <Typography>
                        {item[0]}:
                      </Typography>

                      <Box
                        sx={{
                          width: "60%"
                        }}
                      >

                        <Box
                          sx={{
                            border:
                              "1px solid #d1d5db",

                            borderRadius: 1,

                            px: 1.5,

                            py: 1,

                            minHeight: 40,

                            display: "flex",

                            alignItems: "center",
                          }}
                        >

                          <Typography>
                            {item[1]}
                          </Typography>

                        </Box>

                      </Box>

                    </Box>
                  )
                )}

              </Box>

            </Box>

          </Box>


          {/* FOOTER */}
          <Box
            sx={{
              textAlign:
                "center",
            }}
          >

            <Typography
              sx={{
                marginTop:
                  "5px"
              }}

              textAlign="center"

              variant="h5"

              color="text.secondary"
            >
              માપ ચેક કરી ને રજા લેવી
              <br />
              કટિંગ કરેલ માલ પાછો રાખવા માં નહિ આવે
            </Typography>

          </Box>

        </Box>
      );
    }
  );

export default
QuotationPdfTemplate;