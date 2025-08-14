import { createApp } from "./app";
import { config } from "./config";

const startServer = () => {
  const app = createApp();

  app.listen(config.server.port, () => {
    console.log(`Backend running on http://localhost:${config.server.port}`);
  });
};

startServer();
