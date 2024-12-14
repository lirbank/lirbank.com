import os from "os";

const PORT = process.env["PORT"];

if (!PORT) {
  throw new Error("PORT is not set");
}

const getLocalExternalIP = () => {
  const ifaces = os.networkInterfaces();

  for (const dev in ifaces) {
    if (!ifaces[dev]) continue;
    for (const details of ifaces[dev]) {
      if (details.family === "IPv4" && !details.internal) {
        return details.address;
      }
    }
  }

  return "127.0.0.1";
};

const w = 48;

const padLine = (text: string): string => {
  return `│ ${text}${" ".repeat(Math.max(0, w - 3 - text.length))}│`;
};

const logPadded = (text = "") => {
  console.log(padLine(text));
};

console.log("╭" + "─".repeat(w - 2) + "╮");
logPadded(`Local:    http://localhost:${PORT}/`);
logPadded(`Network:  http://${getLocalExternalIP()}:${PORT}/`);
logPadded();
logPadded(`To open the app in dev mode on a phone or`);
logPadded(`tablet, use the network address. Make sure`);
logPadded(`the device is connected to the same Wi-Fi or`);
logPadded(`network as this computer.`);
console.log("╰" + "─".repeat(w - 2) + "╯");
