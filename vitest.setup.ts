import "@testing-library/jest-dom";

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollIntoView for tests
Element.prototype.scrollIntoView = () => {};
