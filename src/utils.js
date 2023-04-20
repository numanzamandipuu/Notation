export let defaultHighlightSheet = 600;
export let defaultRestSheet = 90;
export let defaultAlgorithm = "- 0 1 1 2 0.4";

export function notation() {
  function parseAlgorithm(algorithm) {
    try {
      var res = {
        exclude: true,
        sizes: [],
        restRatio: 0.4,
      };
      let parts = algorithm.split(" ");

      if (parts[0] == "+") {
        res.exclude = false;
      }

      res.restRatio = Number(parts[parts.length - 1]);

      for (var i = 1; i < parts.length - 1; i++) {
        res.sizes.push(parts[i]);
      }
      return res;
    } catch {
      var defaultRes = {
        exclude: true,
        sizes: [1, 1, 2],
        restRatio: 0.4,
      };
      console.log("not parsed");
      console.log(defaultRes);
      return defaultRes;
    }
  }

  chrome.storage.sync.get(["algorithm"], (data) => {
    var algorithm = parseAlgorithm(data.algorithm);

    function createStylesheet() {
      chrome.storage.sync.get(["highlightSheet", "restSheet"], function (data) {
        var style = document.createElement("style");
        style.type = "text/css";
        style.id = "notation-style-id";
        style.innerHTML =
          ".notation-highlight {" +
          data.highlightSheet +
          " } .notation-rest {" +
          data.restSheet +
          "}";
        document.getElementsByTagName("head")[0].appendChild(style);
      });
    }

    function deleteStyleSheet() {
      var sheet = document.getElementById("notation-style-id");
      sheet.remove();
    }

    function hasStyleSheet() {
      return document.getElementById("notation-style-id") != null;
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

    function notationifyWord(word) {
      function isCommon(word) {
        return commonWords.indexOf(word) != -1;
      }

      var index = word.length - 1;
      var numBold = 1;

      if (word.length <= 3 && algorithm.exclude) {
        if (isCommon(word)) return word;
      }

      if (index < algorithm.sizes.length) {
        numBold = algorithm.sizes[index];
      } else {
        numBold = Math.ceil(word.length * algorithm.restRatio);
      }

      if (word.charCodeAt(numBold) == 2509) {
        numBold += 2;
        if (word.charCodeAt(numBold) == 2509) {
          numBold += 2;
        }
        if (word.charCodeAt(numBold - 1) == 2509) {
          numBold ++;
        }
      }

      if (word.charCodeAt(numBold - 1) == 2509) {
        numBold ++;
        if (word.charCodeAt(numBold) == 2509) {
          numBold += 2;
        }
        if (word.charCodeAt(numBold - 1) == 2509) {
          numBold ++;
        }
      }
      
      if (word.charCodeAt(numBold - 1) == 2479 || word.charCodeAt(numBold - 1) == 2465 || word.charCodeAt(numBold - 1) == 2466 && word.charCodeAt(numBold) == 2492) {
        numBold++;
      }
      
      if (word.charCodeAt(numBold) >= 2494 && word.charCodeAt(numBold) <= 2508) {
        numBold++;
      }
      
      if (word.charCodeAt(numBold) >= 2433 && word.charCodeAt(numBold) <= 2435) {
        numBold++;
      }

      return (
        '<notation class="notation-highlight">' +
        word.slice(0, numBold) +
        "</notation>" +
        '<notation class="notation-rest">' +
        word.slice(numBold) +
        "</notation>"
      );
    }

    function notationifyText(text) {
      var res = "";
      if (text.length < 10) {
        return text;
      }
      for (var word of text.split(" ")) {
        res += notationifyWord(word) + " ";
      }
      return res;
    }

    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    };

    function escapeHtml(string) {
      return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
      });
    }

    function htmlUnescape(str) {
      return str
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#x2F/g, "/")
        .replace(/&#x3D;/g, "=")
        .replace(/&#x60;/g, "`");
    }

    function sanitize(unsafe_str) {
      return unsafe_str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;");
      // .replace(/\'/g, "&#39;");
      // .replace(/\//g, "&#x2F;");
    }

    function notationifyNode(node) {
      if (
        node.tagName === "SCRIPT" ||
        node.tagName === "STYLE" ||
        node.nodeType === 8
      )
        return;
      if (node.childNodes == undefined || node.childNodes.length == 0) {
        if (node.textContent != undefined && node.tagName == undefined) {
          var newNode = document.createElement("notation");
          newNode.innerHTML = notationifyText(sanitize(node.textContent));
          if (node.textContent.length > 20) {
            node.replaceWith(newNode);
          }
        }
      } else {
        for (var child of node.childNodes) {
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

export function patternsInclude(patterns, url) {
  for (var pattern of patterns) {
    if (url.match(pattern)) {
      return true;
    }
  }
  return false;
}
