module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|frag|vert)$/,
      use: [
        "glslify-import-loader",
        {
          loader: "raw-loader",
          options: {
            esModule: false,
          },
        },
        "glslify-loader",
      ],
    });
    return config;
  },
};
