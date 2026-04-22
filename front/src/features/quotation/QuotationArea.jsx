import React, { useContext, useState } from "react";
import { Stack, Paper, Typography } from "@mui/material";

import QuotationStats from "./components/QuotationStats";
import QuotationActions from "./components/QuotationActions";
import ShowQuotations from "./components/ShowQuotations";
import { QuotationContext } from "../../contexts/quotation/quotationContext";

const QuotationArea = () => {
  const { quotations } = useContext(QuotationContext);

  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredData =
    quotations
      .filter((item) =>
        filter === "ALL" ? true : item.status === filter
      )
      .filter((item) => {
        const query = search.toLowerCase();

        const matchName = item.cliName
          ?.toLowerCase()
          .includes(query);
        
        const matchAmount = item.total
          ?.includes(query)

        const matchThickness = item.materials?.some((m) =>
          m.gej?.toString().toLowerCase().includes(query)
        );

        return matchName || matchThickness || matchAmount;
      });

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #e2e8f0",
      }}
    >
      <Stack spacing={2}>

        {/* Header */}
        <Typography variant="h4" fontWeight="bold">
          Quotations
        </Typography>

        {/* Stats */}
        <QuotationStats />

        {/* Actions */}
        <QuotationActions setFilter={setFilter} setSearch={setSearch} />

        {/* Data / Empty State */}
        {quotations.length > 0 ? (
          <ShowQuotations data={filteredData} />
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