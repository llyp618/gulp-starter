module.exports = {
	watch: 'true',
	devtool: "#cheap-module-eval-source-map",
	module: {
		rules: [{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								['env', {
									modules: false,
									targets: {
										browsers: ["last 2 versions", "not ie <= 8"]
									}
								}]
							],
							plugins: [
								"transform-runtime"
							]
						}
					}
				}
		]
	}
}