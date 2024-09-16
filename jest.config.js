// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',  // This should point to your Next.js app directory
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: 'jsdom',
  // Other options you can configure as needed
}

// createJestConfig is a function that takes your custom config
module.exports = createJestConfig(customJestConfig)
