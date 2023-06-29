module.exports = function (api) {
  console.log({ api });
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      require.resolve("expo-router/babel"),
      [
        "module-resolver",
        {
          root: ["./app"],
          alias: {
            "@assets": "./assets",
            "@components": "./components",
            "@utils": "./utils",
          },
        },
      ],
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
