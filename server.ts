import app from "./src/app";

const port = process.env.PORT || 5000;

const startServer = () => {
  app.listen(port, () => {
    console.log(`server is running on ${port}`);
  });
};

startServer();
