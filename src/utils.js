export let defaultHighlightSheet = 600;
export let defaultRestSheet = 90;
export let defaultAlgorithm = "- 0 1 1 2 0.4";

export function notation() {
/**
 * Parses a string algorithm into a configuration object.
 * @param {string} algorithm - The algorithm string to parse.
 * @returns {object} The parsed configuration object.
 */
function parseAlgorithm(algorithm) {
  // Define the default result object
  var res = {
    exclude: true,
    sizes: [],
    restRatio: 0.4,
  };

  try {
    // Split the algorithm string by spaces
    let parts = algorithm.split(" ");

    // Set the exclude flag based on the first part
    res.exclude = parts[0] !== "+";

    // Parse the rest ratio from the last part
    res.restRatio = Number(parts[parts.length - 1]);

    // Collect sizes from the middle parts of the string
    for (var i = 1; i < parts.length - 1; i++) {
      res.sizes.push(parts[i]);
    }
  } catch {
    // Set the default response if parsing fails
    res = {
      exclude: true,
      sizes: [1, 1, 2],
      restRatio: 0.4,
    };
    // Log the error and the default response
    console.log("Algorithm not parsed, using default.");
    console.log(res);
  }
  return res;
}

  chrome.storage.sync.get(["algorithm"], (data) => {
    var algorithm = parseAlgorithm(data.algorithm);

    /**
     * This function creates a stylesheet and appends it to the document's head.
     * It fetches user-defined styles from chrome.storage and applies them.
     */
    function createStylesheet() {
      // Retrieve the style settings from chrome.storage
      chrome.storage.sync.get(
        ["highlightSheet", "restSheet"],
        function (data) {
          // Create a new style element
          var style = document.createElement("style");
          style.type = "text/css";
          style.id = "notation-style-id";

          // Construct the CSS rules using template literals
          style.innerHTML = 
            `.notation-highlight {${data.highlightSheet}} ` +
            `.notation-rest {${data.restSheet}}`;

          // Append the style element to the document head
          document.head.appendChild(style);
        }
      );
    }

    /**
     * Deletes the stylesheet with the specified ID from the document.
     */
    function deleteStyleSheet() {
      // Get the stylesheet element by its ID
      var sheet = document.getElementById("notation-style-id");
      
      // Remove the stylesheet element from the document
      sheet.remove();
    }

    /**
     * Check if the stylesheet exists in the document.
     * @return {boolean} True if the stylesheet exists, otherwise false.
     */
    function hasStyleSheet() {
      // Check for the presence of the stylesheet by ID
      const styleSheetExists = 
        document.getElementById("notation-style-id") !== null;
      return styleSheetExists;
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
      function isCommon(word) {
        return commonWords.indexOf(word) != -1;
      }

      // Initialize variables for the index and number of bold characters.
      var index = word.length - 1;
      var numBold = 1;

      // Return word as is if it's short and excluded by algorithm.
      if (word.length <= 3 && algorithm.exclude) {
        if (isCommon(word)) return word;
      }

      // Determine the number of characters to bold.
      if (index < algorithm.sizes.length) {
        numBold = algorithm.sizes[index];
      } else {
        numBold = Math.ceil(word.length * algorithm.restRatio);
      }

      // Adjust numBold for special characters.
      function adjustForSpecialChars(offset) {
        if (word.charCodeAt(numBold + offset) === 2509) {
          numBold += 2;
        }
        if (word.charCodeAt(numBold + offset - 1) === 2509) {
          numBold++;
        }
      }

      adjustForSpecialChars(0);
      adjustForSpecialChars(-1);

      // Increment numBold for specific unicode ranges.
      const lastCharUnicode = word.charCodeAt(numBold - 1);
      if (lastCharUnicode === 2479 || lastCharUnicode === 2465 ||
          lastCharUnicode === 2466 && word.charCodeAt(numBold) === 2492) {
        numBold++;
      }

      if (word.charCodeAt(numBold) >= 2494 && word.charCodeAt(numBold) <= 2508) {
        numBold++;
      }

      if (word.charCodeAt(numBold) >= 2433 && word.charCodeAt(numBold) <= 2435) {
        numBold++;
      }

      // Wrap the bold and rest parts of the word with notation markup.
      return (
        '<notation class="notation-highlight">' +
        word.slice(0, numBold) +
        "</notation>" +
        '<notation class="notation-rest">' +
        word.slice(numBold) +
        "</notation>"
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

      // Split text into words and process each word
      const words = text.split(" ");
      const processedWords = words.map(notationifyWord);

      // Join processed words back into a string
      return processedWords.join(" ");
    }

    // Map of characters to their HTML entity equivalents
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    /**
     * Escapes HTML characters in a string to their corresponding entities.
     *
     * @param {string} str - The string to escape HTML characters from.
     * @return {string} The escaped string.
     */
    function escapeHtml(str) {
      // Convert input to string and replace special characters
      return String(str).replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
    }

    /**
     * Converts HTML entities in a string back to their original characters.
     * @param {string} str - The string with HTML entities.
     * @return {string} The string with HTML entities decoded.
     */
    function htmlUnescape(str) {
      // Mapping of HTML entities to their respective characters
      const htmlEntities = {
        '&amp;': '&',
        '&quot;': '"',
        '&#39;': "'",
        '&lt;': '<',
        '&gt;': '>',
        '&#x2F;': '/',
        '&#x3D;': '=',
        '&#x60;': '`'
      };

      // Replace each HTML entity in the string with the corresponding character
      return Object.keys(htmlEntities).reduce((accum, entity) => {
        return accum.replace(new RegExp(entity, 'g'), htmlEntities[entity]);
      }, str);
    }

    /**
     * Sanitizes a string by escaping HTML special characters.
     *
     * @param {string} unsafe_str - The string to sanitize.
     * @return {string} - The sanitized string.
     */
    function sanitize(unsafe_str) {
      // Replace ampersand
      let safe_str = unsafe_str.replace(/&/g, "&amp;");
      // Replace less than and greater than
      safe_str = safe_str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      // Replace double quotes
      safe_str = safe_str.replace(/\"/g, "&quot;");
      return safe_str;
    }

    /**
     * Converts text nodes into `notation` elements if certain conditions are met.
     * @param {Node} node - The DOM node to process.
     */
    function notationifyNode(node) {
      // Return early if the node is a SCRIPT, STYLE, or comment
      if (node.tagName === "SCRIPT" || node.tagName === "STYLE" ||
          node.nodeType === 8) {
        return;
      }

      // Process if there are no child nodes
      if (node.childNodes === undefined || node.childNodes.length === 0) {
        // Check for text content without a tagName
        if (node.textContent !== undefined && node.tagName === undefined) {
          // Create a new notation element
          let newNode = document.createElement("notation");
          newNode.innerHTML = notationifyText(
            sanitize(node.textContent)
          );

          // Replace the node if text content length is over 20
          if (node.textContent.length > 20) {
            node.replaceWith(newNode);
          }
        }
      } else {
        // Recursively process all child nodes
        for (let child of node.childNodes) {
          notationifyNode(child);
        }
      }
    }

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
  // Iterate over all patterns to see if any matches the URL
  for (const pattern of patterns) {
    if (url.match(pattern)) {
      // Return true if a pattern matches the URL
      return true;
    }
  }
  // Return false if no patterns match the URL
  return false;
}
