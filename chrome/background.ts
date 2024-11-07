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
    args: [],
    func: () => {
      const selector = "h1";
      const element = document.querySelector(selector);

      if (!element) {
        console.error("Element not found:", selector);
        return;
      }

      const text = element.innerText;
      const url =
        new URL(window.location.href).origin +
        new URL(window.location.href).pathname;
      const formattedText = `${text}\t${url}`;

      // Send data to background script instead of handling IndexedDB here
      void chrome.runtime.sendMessage({
        type: "SAVE_CLIP",
        data: { text, url, formattedText },
      });

      // Continue with clipboard operation
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

// Add message listener for IndexedDB operations
chrome.runtime.onMessage.addListener((message) => {
  console.log("message", message);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (message.type === "SAVE_CLIP") {
    const request = indexedDB.open("ClipboardHistory", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("clips")) {
        db.createObjectStore("clips", { keyPath: "timestamp" });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["clips"], "readwrite");
      const store = transaction.objectStore("clips");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const clip = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...message.data,
        timestamp: new Date().getTime(),
      };

      console.log("clip", clip);

      store.add(clip);

      getAllClips();
    };
  }
});

// Add this function to help debug
function getAllClips() {
  const request = indexedDB.open("ClipboardHistory", 1);

  request.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    const transaction = db.transaction(["clips"], "readonly");
    const store = transaction.objectStore("clips");
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
      console.log("All clips:", getAllRequest.result);
    };
  };
}

// Call it after each save or manually in the console
// getAllClips();
