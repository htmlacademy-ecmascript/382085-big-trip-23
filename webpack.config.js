const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js', // Точка входа
  output: {
    filename: 'bundle.[contenthash].js', // Имя файла сборки с хэшированием
    path: path.resolve(__dirname, 'build'), // Директория для файлов сборки
    clean: true, // Очищать директорию сборки перед новой сборкой
  },
  devtool: 'source-map', // Генерируем карту исходного кода
  plugins: [ // Подключаем плагины
    // для генерации HTML по шаблону
    new HtmlPlugin({
      template: 'public/index.html',
    }),
    // для копирования статических файлов в директорию сборки
    new CopyPlugin({
      patterns: [
        {
          from: 'public', // откуда
          globOptions: {
            ignore: ['**/index.html'], // это шаблон для плагина генерации HTML
          },
        },
      ],
    }),
  ],
  module: {
    rules: [ // Добавляем лоадеры
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
};
