// src/helpers/currencyRates.js

export const hardcodedPrices = {
  "United States": {
    "1 month": 49.99,
    "half year": 249.99,
    "annual": 499.53,
    "lifetime": 3499.99
  },
  "Canada": {
    "1 month": 68.56,
    "half year": 342.88,
    "annual": 685.1553,
    "lifetime": 4800.58
  },
  "United Kingdom": {
    "1 month": 39.32,
    "half year": 196.58,
    "annual": 392.80,
    "lifetime": 2752.18
  },
  "Australia": {
    "1 month": 74.96,
    "half year": 374.86,
    "annual": 749.05,
    "lifetime": 5248.24
  },
  "India": {
    "1 month": 4171.16,
    "half year": 20859.16,
    "annual": 41680.78,
    "lifetime": 292039.16
  }
};

export const convertCurrency = (price, country) => {
  const { symbol } = hardcodedPrices[country] || { symbol: "$" };
  return { price: price.toFixed(2), symbol };
};
