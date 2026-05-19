import localConnection
from "../../config/localDb.js";

import quotationSchema
from "../../schemas/QuotationSchema.js";

const Quotation =
  localConnection.model(
    "Quotation",
    quotationSchema
  );

export default Quotation;