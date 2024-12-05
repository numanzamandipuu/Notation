export let defaultHighlightSheet = 600;
export let defaultRestSheet = 90;
export let defaultAlgorithm = "- 0 1 1 2 0.4";

export function notation() {
/**
 * Parses an algorithm string into a configuration object.
 * @param {string} algorithm - The algorithm string to parse.
 * @returns {object} The parsed configuration object.
 */
function parseAlgorithm(algorithm) {
  const defaultConfig = {
    exclude: true,
    sizes: [1, 1, 2],
    restRatio: 0.4,
  };

  try {
    const parts = algorithm.split(" ");
    if (parts.length < 2) return defaultConfig; // Ensure minimal valid input

    // Initialize result object with default values
    const config = {
      exclude: parts[0] !== "+",
      sizes: parts.slice(1, -1).map(Number), // Convert sizes to numbers
      restRatio: parseFloat(parts[parts.length - 1]),
    };

    // Validate restRatio and sizes
    if (isNaN(config.restRatio) || config.sizes.some(isNaN)) {
      throw new Error("Invalid number format in algorithm.");
    }
    return config;
  } catch (error) {
    console.warn("Algorithm parsing failed, using default config:", defaultConfig);
    return defaultConfig;
  }
}

  chrome.storage.sync.get(["algorithm"], (data) => {
    var algorithm = parseAlgorithm(data.algorithm);

    /**
     * Creates a stylesheet and appends it to the document's head.
     * Fetches user-defined styles from chrome.storage and applies them.
     */
    function createStylesheet() {
      chrome.storage.sync.get(["highlightSheet", "restSheet"], (data) => {
        let style = document.getElementById("notation-style-id");

        // Create the style element if it doesn't exist
        if (!style) {
          style = document.createElement("style");
          style.id = "notation-style-id";
          document.head.appendChild(style);
        }

        // Apply the CSS rules using template literals
        style.innerHTML = `
          .notation-highlight { ${data.highlightSheet || ""} }
          .notation-rest { ${data.restSheet || ""} }
        `;
      });
    }

    /**
     * Deletes the stylesheet with the specified ID from the document, if it exists.
     */
    function deleteStyleSheet() {
      document.getElementById("notation-style-id")?.remove();
    }

    /**
     * Checks if the stylesheet with the specified ID exists in the document.
     * @return {boolean} True if the stylesheet exists, otherwise false.
     */
    function hasStyleSheet() {
      return !!document.getElementById("notation-style-id");
    }

    let commonWords = [
      "the",
      "be",
      "to",
      "of",
      "and",
      "a",
      "an",
      "it",
      "at",
      "on",
      "he",
      "she",
      "but",
      "is",
      "my",
    ];

    /**
     * Modifies a word to include notation markup based on certain rules.
     * @param {string} word - The word to be notationified.
     * @returns {string} - The word wrapped in notation markup.
     */
    function notationifyWord(word) {
      // Helper function to check if a word is common.
      const isCommon = (word) => commonWords.includes(word);

      // Short word handling based on algorithm settings.
      if (word.length <= 3 && algorithm.exclude && isCommon(word)) {
        return word;
      }

      // Determine the number of characters to bold.
      let numBold = algorithm.sizes[word.length - 1] || Math.ceil(word.length * algorithm.restRatio);

      // Adjust numBold for special characters.
      const adjustForSpecialChars = (offset) => {
        const charCode = word.charCodeAt(numBold + offset);
        if (charCode === 2509) numBold += 2;
        else if (word.charCodeAt(numBold + offset - 1) === 2509) numBold++;
      };

      adjustForSpecialChars(0);
      adjustForSpecialChars(-1);

      // Additional checks for specific Unicode ranges.
      const lastCharUnicode = word.charCodeAt(numBold - 1);
      const nextCharUnicode = word.charCodeAt(numBold);
      if (
        [2479, 2465, 2466].includes(lastCharUnicode) && nextCharUnicode === 2492 ||
        (nextCharUnicode >= 2494 && nextCharUnicode <= 2508) ||
        (nextCharUnicode >= 2433 && nextCharUnicode <= 2435)
      ) {
        numBold++;
      }

      // Wrap the bold and rest parts of the word with notation markup.
      return (
        `<notation class="notation-highlight">${word.slice(0, numBold)}</notation>` +
        `<notation class="notation-rest">${word.slice(numBold)}</notation>`
      );
    }

    /**
     * Convert text to a specific notation by processing each word.
     * @param {string} text - The text to be processed.
     * @returns {string} The processed text with notation applied.
     */
    function notationifyText(text) {
      // Return early if text is shorter than 10 characters
      if (text.length < 10) return text;

      // Process each word, applying notation, then join back into a single string
      return text
        .split(" ")
        .map(notationifyWord)
        .join(" ");
    }

    // Map of characters to their HTML entity equivalents
    const entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "`": "&#x60;",
      "=": "&#x3D;",
      "/": "&#x2F;",
    };

    const reverseEntityMap = Object.fromEntries(
      Object.entries(entityMap).map(([key, value]) => [value, key])
    );

    /**
     * Escapes HTML characters in a string to their corresponding entities.
     *
     * @param {string} str - The string to escape HTML characters from.
     * @return {string} The escaped string.
     */
    function escapeHtml(str) {
      return String(str).replace(/[&<>"'`=\/]/g, (char) => entityMap[char]);
    }

    /**
     * Converts HTML entities in a string back to their original characters.
     *
     * @param {string} str - The string with HTML entities.
     * @return {string} - The string with HTML entities decoded.
     */
    function htmlUnescape(str) {
      return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x60;|&#x3D;|&#x2F;/g, (match) => reverseEntityMap[match]);
    }

    /**
     * Sanitizes a string by escaping HTML special characters.
     *
     * @param {string} unsafe_str - The string to sanitize.
     * @return {string} - The sanitized string.
     */
    function sanitize(unsafe_str) {
      return escapeHtml(unsafe_str);
    }

    /**
     * Converts text nodes into `notation` elements if certain conditions are met.
     * @param {Node} node - The DOM node to process.
     */
    function notationifyNode(node) {
      // Skip SCRIPT, STYLE, and comment nodes
      if (["SCRIPT", "STYLE"].includes(node.tagName) || node.nodeType === 8) return;
    
      // If the node has no children, process text content directly
      if (!node.childNodes || node.childNodes.length === 0) {
        if (node.textContent && !node.tagName) {
          // Only create a notation element for text content over 20 characters
          if (node.textContent.length > 20) {
            const newNode = document.createElement("notation");
            newNode.innerHTML = notationifyText(sanitize(node.textContent));
            node.replaceWith(newNode);
          }
        }
      } else {
        // Recursively process all child nodes
        node.childNodes.forEach(notationifyNode);
      }
    }
    
    // Main execution
    if (hasStyleSheet()) {
      deleteStyleSheet();
    } else {
      createStylesheet();
      notationifyNode(document.body);
    }    
  });
}

/**
 * Check if the given URL matches any pattern in the list.
 *
 * @param {string[]} patterns - Array of string patterns.
 * @param {string} url - The URL to be tested against patterns.
 * @return {boolean} - Returns true if a match is found, otherwise false.
 */
export function patternsInclude(patterns, url) {
  // Use Array.some() to return true as soon as a match is found
  return patterns.some((pattern) => url.match(pattern));
}
