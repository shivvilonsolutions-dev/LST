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

  const [
    selectedMonth,

    setSelectedMonth
  ] = useState(null);

  if (loading) {
    return <PageLoader />;
  }
  const filteredData =
    quotations

      .filter((item) =>

        filter === "ALL"

          ? true

          : item.status === filter
      )

      .filter((item) => {

        if (!selectedMonth) {
          return true;
        }

        const quotationDate =
          new Date(
            item.quotationDate
          );


        const sameMonth =
          quotationDate
            .getMonth()

          ===

          selectedMonth
            .getMonth();


        const sameYear =
          quotationDate
            .getFullYear()

          ===

          selectedMonth
            .getFullYear();


        // IF USER SELECTED SPECIFIC DATE
        if (
          selectedMonth.getDate() > 1
        ) {
          return (

            sameMonth &&

            sameYear &&

            quotationDate
              .getDate()

            ===

            selectedMonth
              .getDate()
          );
        }


        // ONLY MONTH + YEAR
        return (
          sameMonth &&
          sameYear
        );
      })

      // SEARCH FILTER
      .filter((item) => {

        const query =
          search
            .toLowerCase()
            .trim();


        const quotationDate =
          new Date(
            item.quotationDate
          );


        const formattedDate =
          quotationDate
            .getDate()
            .toString();


        const formattedMonth =
          quotationDate
            .toLocaleString(
              "default",
              {
                month: "long",
              }
            )
            .toLowerCase();


        const formattedYear =
          quotationDate
            .getFullYear()
            .toString();


        const fullDate =
          `${formattedDate} ${formattedMonth} ${formattedYear}`;


        const matchDate =
          formattedDate.includes(query)
          ||
          formattedMonth.includes(query)
          ||
          formattedYear.includes(query)
          ||
          fullDate.includes(query);


        const matchName =
          item?.cliName
            ?.toLowerCase()
            .includes(query);

        const matchThickness =
          item.materials?.some(
            (m) =>
              m.gauge
                ?.toString()
                .toLowerCase()
                .includes(query)
          );

        const matchWhatsapp =
          item.whatsapp
            ?.toString()
            .toLowerCase()
            .includes(query);

        const matchLaserCutting =
          item.laserCutting
            ?.toString()
            .toLowerCase()
            .includes(query);

        return (
          matchName || matchThickness || matchWhatsapp || matchLaserCutting || matchDate
        );
      })

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
        />

        {/* Data */}
        {quotations.length > 0 ? (

          <ShowQuotations
            data={filteredData}
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