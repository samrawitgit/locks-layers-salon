module.exports = function (api) {
  console.log({ api });
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [require.resolve("expo-router/babel")],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
