const apiKey = "a94c9e9d6971cbacf100da9b78e47c53";
const stockSymbols = ["AAPL", "GOOGL", "MSFT"];

const companyInfo = {
  "AAPL": {
    name: "Apple Inc.",
    industry: "Consumer Electronics",
    website: "https://www.apple.com",
    description: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide."
  },
  "GOOGL": {
    name: "Alphabet Inc.",
    industry: "Internet Content & Information",
    website: "https://abc.xyz",
    description: "Alphabet is a collection of businesses, including Google, that provides a wide range of internet products and services globally."
  },
  "MSFT": {
    name: "Microsoft Corporation",
    industry: "Software—Infrastructure",
    website: "https://www.microsoft.com",
    description: "Microsoft develops, licenses, and supports software, services, devices, and solutions worldwide."
  }
};

async function fetchAllStocks(symbols) {
  const url = `http://api.marketstack.com/v1/eod/latest?access_key=${apiKey}&symbols=${symbols.join(",")}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.data;
}

function formatChange(change) {
  const cls = change >= 0 ? "green" : "red";
  const sign = change >= 0 ? "+" : "";
  return `<div class="change ${cls}">${sign}${change.toFixed(2)}</div>`;
}

async function updateStocks() {
  const container = document.querySelector(".stocks");
  container.innerHTML = `<h3>Stocks</h3>`;
  const stockData = await fetchAllStocks(stockSymbols);

  stockData.forEach(data => {
    const change = data.close - data.open;
    const stockHTML = `
      <div class="stock-item-link" onclick="openModal('${data.symbol}')">
        <div class="stock-item">
          <div class="name-block">
            <div class="symbol">${data.symbol}</div>
            <div class="currency">${data.close.toFixed(2)} USD</div>
          </div>
          <div class="price-block">
            <div class="price">${data.close.toFixed(2)}</div>
            ${formatChange(change)}
          </div>
        </div>
      </div>
    `;
    container.innerHTML += stockHTML;
  });
}

function openModal(symbol) {
  const modal = document.getElementById("stockModal");
  const title = document.getElementById("modalTitle");
  const chart = document.getElementById("chartContainer");
  const infoBox = document.getElementById("modalCompanyInfo");

  title.textContent = `${symbol} Stock Chart`;
  chart.innerHTML = "";

  new TradingView.widget({
    "width": "100%",
    "height": 460,
    "symbol": `NASDAQ:${symbol}`,
    "interval": "D",
    "timezone": "Etc/UTC",
    "theme": "light",
    "style": "1",
    "locale": "en",
    "container_id": "chartContainer"
  });

  const info = companyInfo[symbol];
  if (info) {
    infoBox.innerHTML = `
      <h4>${info.name}</h4>
      <p><strong>Industry:</strong> ${info.industry}</p>
      <p><strong>Description:</strong> ${info.description}</p>
      <p><a href="${info.website}" target="_blank">Visit Website</a></p>
    `;
  } else {
    infoBox.innerHTML = `<p>No additional information available.</p>`;
  }

  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("stockModal");
  const chart = document.getElementById("chartContainer");
  const infoBox = document.getElementById("modalCompanyInfo");

  modal.classList.add("hidden");
  chart.innerHTML = "";
  infoBox.innerHTML = "";
}

updateStocks();
