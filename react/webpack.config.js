export const getWebpackConfig = (projectName, projectUrl) => {
  if (typeof projectName !== "string" || typeof projectUrl !== "string") {
    throw new Error("Both projectName and projectUrl must be strings");
  }
};
