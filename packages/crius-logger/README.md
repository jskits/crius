# crius-logger

![Node CI](https://github.com/jskits/crius/workflows/Node%20CI/badge.svg)
[![npm](https://img.shields.io/npm/v/crius-logger.svg)](https://www.npmjs.com/package/crius-logger)

A logger plugin for Crius Test

## Installation

```sh
yarn add -D crius-logger # or npm install -D crius-logger
```

Visit [https://github.com/jskits/crius](https://github.com/jskits/crius) for more documentation.

## Usage

```js
@plugins([logger()])
class TestTodoList extends Step {}
```

## API

### logger(options)

- options <Object> Optional config.
  - path <string> Path to write to log.
