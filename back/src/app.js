import express from "express";
import cors from "cors";

import clientRoutes from "./routes/clientRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Backend Running",
  });
});


// ROUTES
app.use(
  "/api/quotations",
  quotationRoutes
);

app.use(
  "/api/clients",
  clientRoutes
);

app.use(
  "/api/inventories",
  inventoryRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/auth",
  authRoutes
);


// GLOBAL ERROR HANDLER
app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.log(
      "GLOBAL ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
);

export default app;