import React, {
  useContext,
  useState,
} from "react";

import {
  Stack,
  Paper,
  Typography,
} from "@mui/material";

import QuotationStats
  from "./components/QuotationStats";

import QuotationActions
  from "./components/QuotationActions";

import ShowQuotations
  from "./components/ShowQuotations";

import {
  QuotationContext,
} from "../../contexts/quotation/quotationContext";

import ErrorMessage
  from "../../components/ui/ErrorMessage";

import PageLoader
  from "../../components/ui/PageLoader";

const QuotationArea = () => {

  const {
    quotations,
    loading,
    error,
  } = useContext(
    QuotationContext
  );

  const [filter, setFilter] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  const [page, setPage] = useState(0);

  const [
    selectedMonth,

    setSelectedMonth
  ] = useState(null);

  if (loading) {
    return <PageLoader />;
  }

  const filteredData =
    quotations

      // STATUS FILTER
      .filter((item) =>

        filter === "ALL"

          ? true

          : item.status === filter
      )

      // MONTH FILTER
      .filter((item) => {

        if (!selectedMonth) {
          return true;
        }

        const quotationDate =
          new Date(
            item.quotationDate
          );

        return (

          quotationDate.getMonth()

          ===

          selectedMonth.getMonth()

        ) && (

            quotationDate.getFullYear()

            ===

            selectedMonth.getFullYear()
          );
      })

      // SEARCH FILTER
      .filter((item) => {

        const query =
          search
            .toLowerCase()
            .trim();

        if (!query) {
          return true;
        }

        const quotationDate =
          new Date(
            item.quotationDate
          );

        const fullDate =
          quotationDate
            .toLocaleDateString(
              "en-GB"
            )
            .toLowerCase();

        const searchableText = [

          item.cliName,

          item.mobile,

          item.whatsapp,

          item.rateB1,

          item.rateB2,

          item.add,

          item.bending,

          item.laserCutting,

          item.totalPieces,

          item.status,

          fullDate,

          ...(item.materials || [])
            .flatMap(
              (m) => [

                m.size,

                m.piece,

                m.gauge,
              ]
            ),

        ]

          .filter(Boolean)

          .join(" ")

          .toLowerCase();

        return searchableText.includes(
          query
        );
      });

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

      <Stack spacing={2}>

        <ErrorMessage
          message={error}
        />

        {/* Header */}
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Quotations
        </Typography>

        {/* Stats */}
        <QuotationStats />

        {/* Actions */}
        <QuotationActions
          setFilter={setFilter}
          setSearch={setSearch}
          setSelectedMonth={
            setSelectedMonth
          }
          search={search}
          filteredCount={filteredData.length}
        />

        {/* Data */}
        {quotations.length > 0 ? (

          <ShowQuotations
            data={filteredData}
            page={page}
            setPage={setPage}
          />

        ) : (

          <Paper
            elevation={2}
            sx={{
              py: 6,
              textAlign: "center",
              borderRadius: 3,
            }}
          >

            <Typography variant="h6">
              No Quotations
            </Typography>

          </Paper>
        )}

      </Stack>

    </Paper>
  );
};

export default QuotationArea;