const fs = require('fs');
const path = require('path');

class ExampleReader {
    constructor() {
        this.exampleDir = path.join(__dirname, '..', 'example');
    }

    readExampleConfig() {
        return fs.readFileSync(
            path.join(this.exampleDir, 'pageforge.yaml'),
            'utf8'
        );
    }

    readExampleMarkdown() {
        return fs.readFileSync(
            path.join(this.exampleDir, 'index.md'),
            'utf8'
        );
    }
}

module.exports = ExampleReader;