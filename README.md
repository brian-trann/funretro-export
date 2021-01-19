# FunRetro.io export

[![License][license-badge]][license-url]

> CLI tool to easily export [FunRetro.io](https://funretro.io/) retrospective boards using Playwright

## Installing / Getting started

It's required to have [npm](https://www.npmjs.com/get-npm) installed locally to follow the instructions.
To clone the feature branch, follow the shell commands below.

```shell
git clone --branch feature-csv https://github.com/brian-trann/funretro-export.git
cd funretro-export
npm install
```

- to check which branch you are currently using
```shell
git branch
```
- to checkout the feature-csv branch
```shell
git checkout feature-csv
```

## Exporting 
- Must be in funretro-export directory
- The filename will be the name of the board
- The file will be exported to the parent directory

### Text File
- Exports a text file normally outputed by the original program
```shell
npm start -- "http://funretro.io/board..."
```
- Alternatively, to be more explicit, `"txt"` can be passed in as well
```shell
npm start -- "http://funretro.io/board..." "txt"
```

### CSV file
- To generate a csv file, `"csv"` must be passed in after the URL
- Note: generating a csv file will remove commas from the columns and messages
- Only content with at least 1 vote will be included in this file output
```shell
npm start -- "http://funretro.io/board..." "csv"
```

## TODO

- Export card comments
- More export options (PDF)

## Licensing

MIT License

[license-badge]: https://img.shields.io/github/license/robertoachar/docker-express-mongodb.svg
[license-url]: https://opensource.org/licenses/MIT
