const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// décoder le cookie pour travailler avec
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
// dotenv fichier à part pour placer toutes les infos sensibles
// à ne pas commit git (/config/.env)

//pour check l'user à chaque action
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
// pour autoriser les requêtes externes
const cors = require("cors");

require("dotenv").config({ path: "./config/.env" });
require("./config/db");

// CORS pour autoriser pas n'importe qui à avoir accès aux données par les requêtes

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// pour exploiter les cookies correctement
app.use(cookieParser());

// jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

if (process.env.NODE_ENV === "production") {
  // Exprees will serve up production assets
  app.use(express.static("client/build"));

  // Express serve up index.html file if it doesn't recognize route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
