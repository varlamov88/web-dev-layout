const path = require('path');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageMinPlugin = require('imagemin-webpack-plugin').default;
const ImageMinMozJpeg = require('imagemin-mozjpeg');

const argv = require('yargs').argv;
const isProduction = (argv.mode === 'production');

module.exports = {
	context: path.resolve(__dirname, 'src'),
    entry: {
        app: './js/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/[name].' + (isProduction ? '[contenthash].' : '') + 'js',
        chunkFilename: 'js/[id].' + (isProduction ? '[contenthash].' : '') + 'js',
		library: '[name]',
        publicPath: '/'
    },
    devServer: {
        overlay: true,
		historyApiFallback: true,
		open: true
    },
	devtool: !isProduction ? 'source-map' : '',
    module: {
        rules: [
			{
				test: /\.html$/,
				use: [ "html-loader" ]
			},
			{
                test: /\.js$/,
				include: path.resolve(__dirname, 'src/js'),
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
					options: {
						presets: [
							'@babel/preset-env'
						]
					}
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,	
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
					},
					{
						loader: "resolve-url-loader"
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: isProduction ? 
							[								 
								autoprefixer({
									browsers:['last 2 version']
								})
							] : []							
						}
					},
					{
						loader: 'sass-loader',
						options: {
							outputStyle: 'expanded',
						}
					}
				]
				
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/i,		
				exclude: /fonts/,				
                use: [{
                    loader: 'file-loader',
					options: {
						name: '[path][name].[ext]'
					}
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
				exclude: /images/,
                use: [{
                    loader: 'file-loader',
					options: {
						name: '[path][name].[ext]'
					}
                }]
            },			
        ]
    },	
	optimization: {
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true
			}),
			new OptimizeCSSAssetsPlugin({}),
			new ImageMinPlugin({
				pngquant: ({quality: '90'}),
				plugins: [ImageMinMozJpeg({quality: '90'})]
			}),
		],		
		splitChunks: {
			chunks: 'all'
		},
	},
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].' + (isProduction ? '[contenthash].' : '') + '.css',
            chunkFilename: 'css/[id].' + (isProduction ? '[contenthash].' : '') + 'css',
        }),
		new HtmlWebpackPlugin({
			inject: 'head',
			//hash: true,
			template: './index.html',
			filename: 'index.html',
			favicon: 'favicon.ico',
			/*meta: {
				viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
			}*/
		}),
		new CleanWebpackPlugin(['public']),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		}),
    ]
}