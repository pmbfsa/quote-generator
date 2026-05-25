import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/components/icon/icon.js';

import './quotes.js';

const CACHE_KEY = 'apiQuotes';
const CACHE_TTL = 24 * 60 * 60 * 1000;

const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loaderContainer = document.getElementById('loader-container');

let apiQuotes = [];

function setLoaderVisibilty(isVisible) {
  loaderContainer.style.visibility = isVisible ? 'visible' : 'hidden';
  quoteContainer.style.visibility = isVisible ? 'hidden' : 'visible';
}

function tweetQuote() {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${quoteAuthor.textContent}`;
  window.open(tweetUrl, '_blank');
}

function newQuote() {
  setLoaderVisibilty(true);

  // Pick a random quote from apiQuotes array
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];

  // Check quote length to determine styling
  if (quote.text.length > 100) {
    quoteText.classList.add('long-quote');
  } else {
    quoteText.classList.remove('long-quote');
  }

  quoteText.textContent = quote.text;

  // Check if author field is blank and replace it with 'Unknown'
  quoteAuthor.textContent = quote.author ? quote.author : 'Unknown';

  setLoaderVisibilty(false);
}

// Get quotes from Cache, API or locally
async function getQuotes() {
  const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';

  try {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      apiQuotes = data;
      newQuote();

      if (Date.now() - timestamp < CACHE_TTL) return;

      fetchQuotesAndCache(apiUrl).catch(() => {});
      return;
    }
  } catch {
    localStorage.removeItem(CACHE_KEY);
  }

  await fetchQuotesAndCache(apiUrl);
  newQuote();
}

async function fetchQuotesAndCache(apiUrl) {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );

    apiQuotes = data;
  } catch (error) {
    if (!apiQuotes.length) {
      apiQuotes = localQuotes;
    }
  }
}

// Event listener
twitterBtn.addEventListener('click', tweetQuote);
newQuoteBtn.addEventListener('click', newQuote);

// On Load
getQuotes();
