module.exports = {
  "extends": "airbnb",
  "rules": {
    "no-underscore-dangle": [2, { "allowAfterThis": true }],
    "class-methods-use-this": 0,
    "strict": 0,
    "max-len": 0,
    "new-cap": ["error", { "newIsCapExceptionPattern": "^errors\.." }],
    "camelcase": [2, {"properties": "never"}]
  },
  "env": {
    "browser": true,
    "node": true,
  }
};