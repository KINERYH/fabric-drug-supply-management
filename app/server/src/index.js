const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const drugsRouter = require("./routes/drugs.routes")

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.use("/api/drugs", drugsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});