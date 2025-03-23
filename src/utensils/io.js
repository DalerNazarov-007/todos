const fs = require("fs").promises;

class IO {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async read() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            if (error.code === "ENOENT") {
                await this.write([]); // Create the file with an empty array if it doesn't exist
                return [];
            }
            throw error;
        }
    }

    async write(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }
}

module.exports = IO;
