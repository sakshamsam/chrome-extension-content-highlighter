# 🚀 Smart Skimmer – AI-Powered Chrome Extension for Skimming Webpages

Smart Skimmer is a lightweight and intelligent Chrome extension that helps users **skim long-form content** on any webpage by automatically **highlighting the most important points** using **OpenAI’s advanced language models**.

Whether you're reading a lengthy article, research paper, or blog post, Smart Skimmer surfaces the key information **as you scroll**, enabling faster comprehension without missing context.

---

## 🧠 Key Features

- ✨ **AI-Powered Content Analysis**: Uses OpenAI API to understand the page context.
- 📄 **Real-Time Page Scanning**: Automatically processes and scans content on page load.
- 🔍 **Highlight Important Points**: Key insights and relevant sections are highlighted as the user scrolls.
- ⚡ **Performance Optimized**: Asynchronous processing ensures minimal delay or page lag.
- 🌐 **Works on Any Webpage**: Language-model agnostic content understanding on blogs, articles, papers, and more.

---

## 🏗️ Architecture Overview

### 1. **Content Script**
- Injected into every webpage the user visits.
- Extracts visible and relevant content from DOM.
- Sends data to the background script or directly to OpenAI API.

### 2. **Background Script**
- Manages API communication and handles rate-limiting.
- Optional caching layer (e.g., using `chrome.storage`) to avoid redundant requests.

### 3. **OpenAI API Integration**
- Uses `gpt-4` or `gpt-3.5-turbo` model.
- Prompts include:
  - *“Summarize this webpage.”*
  - *“Highlight the most important lines that should not be skipped.”*

### 4. **Highlight Renderer**
- As user scrolls, the script highlights the top insights.
- Supports dynamic content loading and lazy-loaded articles.
- Can include custom styling for visual clarity.

---

## 🛠️ Installation Instructions (Developer Mode)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-skimmer.git
   cd smart-skimmer
