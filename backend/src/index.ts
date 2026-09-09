import { createApp } from "./server.js";

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 LLD Practice Platform Backend running on http://localhost:${PORT}`);
  console.log(`📚 API documentation and health check at http://localhost:${PORT}/health`);
});
