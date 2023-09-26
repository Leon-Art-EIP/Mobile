const reactNativeJestPreset = require('react-native/jest-preset');

module.exports = {
  moduleNameMapper: {
    "\\.(png|jpg|ico|jpeg|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/ImageMock.js",
    '^react-native$': require.resolve('react-native'),
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)/)',
  ],
  transform: {
    ...reactNativeJestPreset.transform,
    '^.+\\.tsx?$': 'babel-jest',
  },
  preset: '@testing-library/react-native',
  collectCoverage: true,
};
