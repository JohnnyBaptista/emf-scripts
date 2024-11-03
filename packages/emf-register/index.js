let componentsToExpose = [];

export function registerComponent(component, name) {
  if (!name) {
    throw new Error("Component name is required");
  }
  if (typeof name !== "string") {
    throw new Error("Component name must be a string");
  }
  if (name.length === 0) {
    throw new Error("Component name must not be empty");
  }
  if (!component) {
    throw new Error("Component is required");
  }
  if (typeof component !== "function") {
    throw new Error("Component must be a function");
  }
  if (!componentsToExpose.find((item) => item.name === name)) {
    componentsToExpose.push({ name, component });
  }
}

export function getRegisteredComponents() {
  return componentsToExpose;
}
