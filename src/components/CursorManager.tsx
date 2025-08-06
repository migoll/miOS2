import { useEffect } from "react";
import { cursors } from "../assets/cursors";

export const CursorManager: React.FC = () => {
  useEffect(() => {
    console.log("CursorManager: Initializing with cursors:", cursors);

    // Test if cursor files are loading
    Object.entries(cursors).forEach(([name, url]) => {
      console.log(`CursorManager: ${name} cursor URL:`, url);
    });

    // Set default cursor for the entire document
    document.body.style.cursor = `url(${cursors.default}) 32 32, auto`;

    // Function to set cursor for an element
    const setCursor = (
      element: HTMLElement,
      cursorType: keyof typeof cursors
    ) => {
      try {
        element.style.cursor = `url(${cursors[cursorType]}) 32 32, auto`;
        console.log(`CursorManager: Set ${cursorType} cursor on`, element);
      } catch (error) {
        console.error(
          `CursorManager: Error setting ${cursorType} cursor:`,
          error
        );
      }
    };

    // Apply cursors to different element types
    const applyCursors = () => {
      console.log("CursorManager: Applying cursors...");

      // Text inputs and textareas
      const textElements = document.querySelectorAll(
        'input[type="text"], input[type="password"], input[type="email"], input[type="search"], input[type="url"], input[type="tel"], textarea, [contenteditable="true"]'
      );
      console.log("CursorManager: Found", textElements.length, "text elements");
      textElements.forEach((element) => {
        setCursor(element as HTMLElement, "text");
      });

      // Critical clickable elements
      const criticalClickableElements = document.querySelectorAll(
        "button, a, .vercel-button, .vercel-traffic-light, .vercel-desktop-icon"
      );
      console.log(
        "CursorManager: Found",
        criticalClickableElements.length,
        "critical clickable elements"
      );
      criticalClickableElements.forEach((element) => {
        setCursor(element as HTMLElement, "pointer");
      });

      // Window resize handles
      const resizeHandles = document.querySelectorAll(".resize-handle");
      console.log(
        "CursorManager: Found",
        resizeHandles.length,
        "resize handles"
      );
      resizeHandles.forEach((element) => {
        const handle = element as HTMLElement;
        const direction = handle.dataset.direction;

        switch (direction) {
          case "n":
          case "s":
            setCursor(handle, "resize-ns");
            break;
          case "e":
          case "w":
            setCursor(handle, "resize-ew");
            break;
          case "nw":
          case "se":
            setCursor(handle, "resize-nwse");
            break;
          case "ne":
          case "sw":
            setCursor(handle, "resize-nesw");
            break;
          default:
            setCursor(handle, "move");
        }
      });

      // Window title bars
      const titleBars = document.querySelectorAll(".vercel-window-titlebar");
      console.log("CursorManager: Found", titleBars.length, "title bars");
      titleBars.forEach((element) => {
        setCursor(element as HTMLElement, "move");
      });

      // Disabled elements
      const disabledElements = document.querySelectorAll(
        "[disabled], .disabled"
      );
      console.log(
        "CursorManager: Found",
        disabledElements.length,
        "disabled elements"
      );
      disabledElements.forEach((element) => {
        setCursor(element as HTMLElement, "not-allowed");
      });
    };

    // Apply cursors initially
    applyCursors();

    // Re-apply cursors when DOM changes
    const observer = new MutationObserver(() => {
      console.log("CursorManager: DOM changed, reapplying cursors");
      applyCursors();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-cursor", "draggable", "disabled"],
    });

    // Handle drag events
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.draggable ||
        target.classList.contains("vercel-desktop-icon")
      ) {
        setCursor(target, "grabbing");
      }
    };

    const handleDragEnd = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.draggable ||
        target.classList.contains("vercel-desktop-icon")
      ) {
        setCursor(target, "grab");
      }
    };

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      observer.disconnect();
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  return null;
};
