# FunRetro.io export

[![License][license-badge]][license-url]

> CLI tool to easily export [FunRetro.io](https://funretro.io/) retrospective boards using Playwright

## Installing / Getting started

It's required to have [npm](https://www.npmjs.com/get-npm) installed locally to follow the instructions.

```shell
git clone https://github.com/julykaz/funretro-export.git
cd funretro-export
npm install
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

### CSV file
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
