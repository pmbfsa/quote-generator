const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

let apiQuotes = [];

// Event listener
twitterBtn.addEventListener('click', tweetQuote);
newQuoteBtn.addEventListener('click', newQuote);

// Show loading
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

// Hide loading
function complete() {
  loader.hidden = true;
  quoteContainer.hidden = false;
}

// Tweet quote
function tweetQuote() {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${quoteAuthor.textContent}`;
  window.open(tweetUrl, '_blank');
}

// Show new quote
function newQuote() {
  loading();

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

  complete();
}

// Get quotes from API
async function getQuotes() {
  const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';

  loading();
  try {
    const response = await fetch(apiUrl);

    // Confirm HTTP response
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}.\nUsing local quotes list.`);
    }

    apiQuotes = await response.json();
    newQuote();
  } catch (error) {
    alert(error);
    apiQuotes = localQuotes;
    newQuote();
  }
}

// On Load
getQuotes();
