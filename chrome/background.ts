/* eslint-disable @typescript-eslint/no-deprecated */
import invariant from "tiny-invariant";
console.log("Background service worker initialized!");

// Log all registered commands on startup with JSON.stringify
void chrome.commands.getAll().then((commands) => {
  console.log("Registered commands:", JSON.stringify(commands, null, 2));
});

// This handler is called for both keyboard shortcut and icon click
chrome.action.onClicked.addListener((tab) => {
  invariant(tab.id, "tab.id is required");

  console.log("Action triggered!", {
    source: "Keyboard shortcut or icon click",
    tabId: tab.id,
    tabUrl: tab.url,
  });

  // Inject and execute the content script
  void chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const selector = "#profile-content h1";
      const element: HTMLElement | null = document.querySelector(selector);

      if (element) {
        const text = element.innerText || element.textContent;
        invariant(text, "text is required");

        const url = window.location.href;
        const formattedText = `${text}\t${url}`;

        navigator.clipboard
          .writeText(formattedText)
          .then(() => {
            console.log("Text and URL copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy text and URL:", err);
          });
      } else {
        console.error("Element not found:", selector);
      }
    },
  });
});
