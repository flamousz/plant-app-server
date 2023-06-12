if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

const express = require("express");
const router = require("./routers");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const errHandler = require("./middlewares/errHandler");

// serve static files
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

app.use("/", router);

app.use(errHandler);

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
