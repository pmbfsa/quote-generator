let apiQuotes = [];

// Show new quote
function newQuote() {
  // Pick a random quote from apiQuotes array
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  console.log(quote);
}

// Get quotes from API
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

// On Load
getQuotes();
