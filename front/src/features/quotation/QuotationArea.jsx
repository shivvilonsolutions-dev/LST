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
      .filter((item) =>
        item.cliName.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <Stack spacing={2}>
      
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
  );
};

export default QuotationArea;