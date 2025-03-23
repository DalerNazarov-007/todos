const fs = require("fs").promises;

class Io {
  constructor(directory) {
    this.directory = directory;
  }

  async read() {
    const data = await fs.readFile(this.directory, "utf8");

    return data ? JSON.parse(data) : [];
  }

  write(data) {
    fs.writeFile(this.directory, JSON.stringify(data, null, 2), "utf8");

    return { success: true };
  }
}

module.exports = Io;
