const path=require('path')
const HtmlWebpackPlugin=require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Promise = require('es6-promise').Promise;
const webpack=require('webpack')
const dotenv = require('dotenv').config({ path: __dirname + '/.env' })
module.exports={
    entry:path.join(__dirname,"src","index.js"),
    output:{
        filename:"index.bundle.js",
        path:path.resolve(__dirname,'build'),
    },
    mode:"development",
    devServer:{
       // contentBase:path.join(__dirname,"src") for the static files which should not be bundled,
       port:3000,
       headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      }
    },
    

  plugins:[

      new HtmlWebpackPlugin({
          template:path.join(__dirname,"src","index.html")
      }),
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['dist']
    }),
    new webpack.DefinePlugin({
        'process.env': JSON.stringify(dotenv.parsed),
    }),
  ],
  module:{
  
      rules:[
          {
              test:/\.(js|jsx)$/,
              exclude:/node_modules/,
              use:["babel-loader"]
          },
          {
              test:/\.(css|scss)$/,
              use:["style-loader","css-loader"]
          },
          {
              test:/\.(jpg|jpeg|png|gif|mp3|svg)$/,
              use:["file-loader"]
          }
      ]
  }
}