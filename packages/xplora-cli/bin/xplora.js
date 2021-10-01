#!/usr/bin/env node

// Handle uncaught exceptions
process.on("unhandledRejection", (err) => {
  console.error(err);
  console.log("An error occured... Exiting processs");
  process.exit(1);
});

const { server, app } = require("../src/server");
const { fetchFilesController } = require("../src/controllers/fetchFiles.js");
const { handleFileChanges } = require("../src/utils/handleFileChanges.js");
const { getPathsValidity } = require("../src/utils/getPathsValidity.js");
const notifyForUpdates = require("../src/utils/notifyForUpdates");
const log = require("../src/utils/log");
const afterListen = require("../src/utils/afterListen");
const { noValidPaths } = require("../src/utils/errorMessages");

const { validPaths, invalidPaths } = getPathsValidity(process.argv.slice(2));

if (validPaths.length === 0) {
  log(noValidPaths(invalidPaths));
  process.exit(0);
}

const PORT = process.env.PORT || 3001;

//Emit event when file change is dectected in {validPaths}
handleFileChanges(validPaths);

//Endpoint to fetch files
app.get("/api", (req, res) => fetchFilesController(req, res, validPaths));

server.listen(PORT, () => afterListen(app, PORT));

notifyForUpdates.notify();
