import os from "os";

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT is not set");
}

const getLocalExternalIP = () => {
  const ifaces = os.networkInterfaces();

  for (const dev in ifaces) {
    for (const details of ifaces[dev]) {
      if (details.family === "IPv4" && !details.internal) {
        return details.address;
      }
    }
  }

  return "127.0.0.1";
};

console.log("-".repeat(80));
console.log(`🚀 Server listening on http://localhost:${PORT}/`);
console.log(`🚀 Server listening on http://${getLocalExternalIP()}:${PORT}/`);
console.log();
console.log(
  `Use the IP number instead of localhost when accessing the app in dev mode from a\nmobile phone on the same network as this server.`,
);
console.log("-".repeat(80));
