/* eslint-disable @typescript-eslint/no-deprecated */
console.log("Background service worker initialized!");

// Log all registered commands on startup with JSON.stringify
void chrome.commands.getAll().then((commands) => {
  console.log("Registered commands:", JSON.stringify(commands, null, 2));
});

// This handler is called for both keyboard shortcut and icon click
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) {
    console.error("tab.id is required");
    return;
  }

  console.log("Action triggered!", {
    source: "Keyboard shortcut or icon click",
    tabId: tab.id,
    tabUrl: tab.url,
  });

  // Inject and execute the content script
  void chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const selector = "h1";
      const element = document.querySelector(selector);

      if (!element) {
        console.error("Element not found:", selector);
        return;
      }

      const text = element.innerText;

      // Get the origin and pathname of the current URL (without query params)
      const url =
        new URL(window.location.href).origin +
        new URL(window.location.href).pathname;

      const formattedText = `${text}\t${url}`;

      navigator.clipboard
        .writeText(formattedText)
        .then(() => {
          console.log("OK");
        })
        .catch((err) => {
          console.error("Failure:", err);
        });
    },
  });
});
