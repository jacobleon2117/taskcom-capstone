module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "babel-plugin-inline-dotenv",
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@navigation": "./src/navigation",
            "@utils": "./src/utils",
            "@assets": "./assets",
            "@env": "./src/env.ts",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
