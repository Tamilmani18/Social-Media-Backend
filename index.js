import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import axios from "axios";

// Security packages
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "views/build")));

const PORT = process.env.PORT || 7000;

dbConnection();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);

// error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

const url = `https://social-media-backend-yv11.onrender.com`;

const interval = 90000;

function reloadWebsite() {
  const now = new Date();
  const currentHour = now.getHours();
  if (currentHour >= 6 && currentHour < 18) {
    axios
      .get(url)
      .then((response) => {
        console.log(
          `Reloaded at ${new Date().toISOString()}: Status Code ${
            response.status
          }`
        );
      })
      .catch((error) => {
        console.error(
          `Error reloading at ${new Date().toISOString()}:`,
          error.message
        );
      });
  } else {
    console.log(
      `Skipping reload at ${new Date().toISOString()}: Outside daytime hours.`
    );
  }
}

setInterval(reloadWebsite, interval);
