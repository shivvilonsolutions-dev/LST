import { useContext } from "react";
import { Box } from "@mui/material";
import StatsCard from "./StatsCard";
import { QuotationContext } from "../../../contexts/quotation/quotationContext";

const QuotationStats = () => {
  const { quotations } = useContext(QuotationContext);

  const confirmCount = quotations.filter(
    (item) => item.status === "CONFIRM"
  ).length;

  const pendingCount = quotations.length - confirmCount;

  return (
    <Box
    sx={{
      display: "flex",
      gap: 2,
      flexWrap: "wrap",
    }}
  >
    
    <Box sx={{ flex: "1 1 250px" }}>
      <StatsCard valColor="gray" cardBgColor="#F0F3F7" title="Total Quotations" value={quotations.length} />
    </Box>

    <Box sx={{ flex: "1 1 250px" }}>
      <StatsCard valColor="red" cardBgColor="#E8E2E1" title="Pending Quotations" value={pendingCount} />
    </Box>

    <Box sx={{ flex: "1 1 250px" }}>
      <StatsCard valColor="green" cardBgColor="#E1E8E1" title="Responded Quotations" value={confirmCount} />
    </Box>

  </Box>
  );
};

export default QuotationStats;