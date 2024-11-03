const fs = require("fs");
const path = require("path");

function getProjectName() {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return packageJson.name;
  } else {
    throw new Error("package.json not found in the root directory");
  }
}

module.exports = { getProjectName };
