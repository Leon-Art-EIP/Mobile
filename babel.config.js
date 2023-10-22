module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
    ['module:metro-react-native-babel-preset'],
  ],
  plugins: [
    ['module:react-native-dotenv'],
  ],
};
