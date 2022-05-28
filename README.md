# ProgSnap2 browser

A tool to investigate and possibly annotate datasets that represent
student programming processes in
[ProgSnap2 format](https://cssplice.github.io/progsnap2/).

### Usage

The tool can be installed locally to open a single CSV file at a time.
Install [Node JS](https://nodejs.org/)
([linux packages](https://github.com/nodesource/distributions)) first.
The following command takes a while to load the CSV into memory and
then it should open the tool in browser (http://localhost:3333/).

    git clone <the_repository_address>
    npm install
    npm start <my_dataset/MainTable.csv>

Alternatively, the tool runs on a Mongo database which helps to scale
for any number of large datasets. The following commands are required to
1) load desired datasets into the database and 2) start serving from the
database.

    npm run load <dataset_id> <my_dataset/MainTable.csv> <description.txt>
    npm start db

The Mongo database must be installed separately (eg. `apt install mongodb`).
Process environment can override default port and database parameters.

    export PORT=3333
    export DB="mongodb://localhost:27017"
    export DB_NAME="progsnap2browser"

### Development

The aim is to follow recent [TypeScript](https://www.typescriptlang.org/)
standards and use [VS Code](https://code.visualstudio.com/).

* `src/types.ts` defines types
* `src/checks.ts` provides some type checking for data
* `src/server` an [Express](https://expressjs.com/) backend to serve
    minimal API over HTTP
* `src/client` a client using [Lit](https://lit.dev/) web components
    (reactive properties automatically re-render elements as required)

Compile the client for the browser:

    npm run build
