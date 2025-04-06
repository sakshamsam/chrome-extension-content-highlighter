console.log("✅ Smart Highlighter content script loaded.");

function injectHighlightStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .smart-highlight {
      background-color: rgba(255, 255, 0, 0.5);
      padding: 2px;
      border-radius: 2px;
    }

    .smart-highlight-active {
      outline: 1px solid orange;
    }
  `;
  document.head.appendChild(style);
}

injectHighlightStyles();

// Wait for the page to fully load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Smart Content Highlighter activated");

  // Give the page a moment to settle
  setTimeout(analyzeAndHighlight, 1000);

  // Highlight content on scroll
  window.addEventListener("scroll", debounce(highlightVisibleContent, 300));
});

// Analyze the page content and identify important points
function analyzeAndHighlight() {
  const textElements = [...document.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6")];

  textElements.forEach((element) => {
    if (element.textContent.trim().length < 20) return;

    const sentences = splitIntoSentences(element.textContent);

    const scoredSentences = sentences.map((sentence) => ({
      text: sentence,
      score: scoreImportance(sentence, element.tagName), // ✅ FIXED
    }));

    scoredSentences.sort((a, b) => b.score - a.score);

    const importantCount = Math.max(1, Math.ceil(scoredSentences.length * 0.3));

    const importantSentences = scoredSentences
      .filter((s) => s.score >= 2) // ✅ FILTER LOW SCORES
      .slice(0, importantCount)
      .map((s) => s.text);

    console.log("Important sentences:", importantSentences); // ✅ DEBUG

    highlightSentences(element, importantSentences);
  });
}

// Split text into sentences
function splitIntoSentences(text) {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
}

// Score a sentence for importance
function scoreImportance(sentence, tagName) {
  let score = 0;

  const words = sentence.split(/\s+/).filter((w) => w.length > 0);
  if (words.length > 5 && words.length < 30) score += 1;
  if (/\d+/.test(sentence)) score += 1;

  const importantKeywords = [
    "important", "significant", "key", "main", "primary", "critical", "vital", "essential", "notable", "impact", "major", "core", "central", "fundamental", "highlight", "definition", "purpose", "objective", "goal", "function", "role", "benefit", "challenge", "problem", "solution", "result", "conclusion", "summary", "explanation", "reason", "finding", "evidence", "support", "recommendation", "strategy", "approach", "method", "process", "framework", "principle", "insight", "innovation", "discovery", "statement", "trend", "analysis", "data", "comparison", "key point", "essentially", "%"
  ];

  importantKeywords.forEach((keyword) => {
    if (sentence.toLowerCase().includes(keyword)) {
      score += 2; // Boost for important keywords
    }
  });

  if (/^\s*[\d•\-*]+\s/.test(sentence)) score += 1;
  if (["H1", "H2", "H3"].includes(tagName)) score += 1;

  return score;
}

// Highlight specific sentences within an element
function highlightSentences(element, importantSentences) {
  console.log("Applying highlights in highlightSentences in content.js");
  if (importantSentences.length === 0) return;

  let html = element.innerHTML;

  importantSentences.forEach((sentence) => {
    const escapedSentence = sentence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim();
    if (escapedSentence.length > 10) {
      const regex = new RegExp(`(${escapedSentence})`, "gi");
      html = html.replace(regex, '<span class="smart-highlight">$1</span>');
    }
  });

  element.innerHTML = html;
}

// Highlight content currently in viewport
function highlightVisibleContent() {
  console.log("Applying highlights in highlightVisibleContent in content.js");
  const highlights = document.querySelectorAll(".smart-highlight");

  highlights.forEach((highlight) => {
    const rect = highlight.getBoundingClientRect();
    const isVisible =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    if (isVisible) {
      highlight.classList.add("smart-highlight-active");
    }
  });
}

// Debounce function to limit rapid scroll handling
function debounce(func, wait) {
  let timeout;
  return function () {
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// Listen to settings update messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateHighlights") {
    const settings = request.settings;
    console.log("Received settings:", settings);
    applyHighlights(settings);
    sendResponse({ status: "success" });
  }
});

// Apply new highlight settings
function applyHighlights(settings) {
  console.log("Applying highlights with settings:", settings);
  analyzeAndHighlight();
}
