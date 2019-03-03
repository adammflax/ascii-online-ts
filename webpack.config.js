const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


module.exports = {
	entry: './src/index.ts',
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	output:{
		filename: 'bundle.js',	
		path : path.resolve(__dirname, 'dist')
	},
    devServer: {
		contentBase: './dist'
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				loader: 'ts-loader', 
				options: {
					transpileOnly: true 
				}
			}
		]
	},
	plugins: [
    new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new ForkTsCheckerWebpackPlugin()
  ],
}