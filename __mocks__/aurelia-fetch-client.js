const fetchClientModule = require.requireActual("aurelia-fetch-client");
fetchClientModule.json = obj => ({mockJson: obj});
module.exports = fetchClientModule;
