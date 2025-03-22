module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@legend-kit': './src/legend-kit',
          '@': './src',
        },
      },
    ],
  ],
};
