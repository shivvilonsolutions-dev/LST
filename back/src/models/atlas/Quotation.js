import atlasConnection
from "../../config/atlasDb.js";

import quotationSchema
from "../../schemas/QuotationSchema.js";

const Quotation =
  atlasConnection.model(
    "Quotation",
    quotationSchema
  );

export default Quotation;