var http = require('http');
var fs = require('fs');
var leituraSincrona = require('./leitura_sync');
var leituraAssincrona = require('./leitura_async');

var file = './node.zip';
var stream = fs.createWriteStream( file );
var download = 'http://nodejs.org/dist/v0.10.12/node-v0.10.12.tar.gz';

var monitoraDownload = function( res )
{
	console.log( 'start download node.' );

	//get total bits
	var total = parseInt( res.headers[ 'content-length' ] );

	res.on( 'data', function( data ){
		//console.log('baixando file...');
		stream.write( data );

		fs.stat( file, function( erro, stat ){

			if ( erro ) throw erro;

			if ( total )
				var porcent = (stat.size / total).toFixed(2);
				console.log( 'downloading: ' + stat.size + ' bits ' + ' total: ' + total + 'bits' + ' % ' + porcent );
		}  )

	} );

	res.on( 'end', function(){
		console.log( 'downloaded.' );
		stream.end();

		leituraAssincrona( file );
		leituraSincrona( file );
	} );
}

// puxando o file da net
http.get( download, monitoraDownload );