const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loaderContainer = document.getElementById('loader-container');

let apiQuotes = [];

function setLoaderVisibilty(isVisible) {
  loaderContainer.hidden = !isVisible;
  quoteContainer.hidden = isVisible;
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

// Get quotes from API or locally
async function getQuotes() {
  const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';

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

// Event listener
twitterBtn.addEventListener('click', tweetQuote);
newQuoteBtn.addEventListener('click', newQuote);

// On Load
getQuotes();
