const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin')

 module.exports={
    mode:"development",
    devtool: 'cheap-module-source-map',
    entry:{
        popup: './src/popup.js',
        background:'./src/background.js',
        
       
        
         },
    module:{
        rules: [
            {
                use:
                    "ts-loader",
                    
                    
                test:/\.tsx$/,
               
                exclude: /node_modules/
            },
            {
                use:["style-loader","css-loader"],
                test:/\.css$/i,
            }
           
             
        ]

    },
    plugins:[
        new CopyPlugin({
            patterns: [
            { 
                from: path.resolve('src/manifest.json'), 
                to: path.resolve('dist') 
            },
            { 
                from: path.resolve('src/assets/icon1.png'), 
                to: path.resolve('dist') 
            },
            
            { from: path.resolve('./src/popup.html'), to:path.resolve( 'dist') },
            { 
                from: path.resolve('./src/content.js'), 
                to: path.resolve('dist') 
            },
            
            
           
            
         ],
        }),
       
        
    ],
   
    resolve:{
        extensions:['.tsx','.ts','.js','.jsx','.css']
    },
    output:{
        filename:'[name].js'
    }
 }