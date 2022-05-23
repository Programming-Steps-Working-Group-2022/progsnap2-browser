# ProgSnap2 browser

A tool to investigate and possibly annotate datasets that represent
student programming processes in
[ProgSnap2 format](https://cssplice.github.io/progsnap2/).

### Usage

The tool can be installed locally to open a single CSV file at a time.
Install [Node JS](https://nodejs.org/)
([linux packages](https://github.com/nodesource/distributions)) first.
The following takes a while to load the CSV into memory and then it
should open the tool in browser (http://localhost:3333/).

    git clone the_repository_address
    npm install
    npm start path_to_your/MainTable.csv

Plans exist to install this online. An alternative backend could support
loading datasets from CSV to database and deliver them on request from UI.

### Development

The aim is to follow recent [TypeScript](https://www.typescriptlang.org/)
standards and use [VS Code](https://code.visualstudio.com/).

* `src/types.ts` defines types
* `src/checks.ts` provides some type checking for data
* `src/server` an [Express](https://expressjs.com/) backend to serve
    minimal API over HTTP
* `src/client` a client using [Lit](https://lit.dev/) web components

Compile the client for the browser:

    npm run build
