var https = require('https');
var fs = require('fs');

var select = require('soupselect').select;
var htmlparser = require("htmlparser");
var http = require('http');
var sys = require('sys');

// var host = 'www.urbandictionary.com';
// var client = http.createClient(80, host);
// var request = client.request('GET', '/define.php?term=Asymptote', {
//     'host': host
// });

// request.on('response', function(response) {
//     response.setEncoding('utf8');

//     var body = "";
//     response.on('data', function(chunk) {
//         body = body + chunk;
//     });

//     response.on('end', function() {

//         // now we have the whole body, parse it and select the nodes we want...
//         var handler = new htmlparser.DefaultHandler(function(err, dom) {
//             if (err) {
//                 console.log("Error: " + err);
//             } else {
//                 //console.log('dom',dom)
//                 var meaning = select(dom, '.meaning');
//                 console.log('meaning', meaning[0].children[0].data);

//             }
//         });

//         var parser = new htmlparser.Parser(handler);
//         parser.parseComplete(body);
//     });
// });
// request.end();

var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};


https.createServer(options, function(req, res) {

    function sendResponse() {
        myResponse = JSON.stringify(echoResponse);
        console.log(myResponse, {
            depth: 5
        });
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }

    function getDefinition(word) {

        var host = 'www.urbandictionary.com';
        var client = http.createClient(80, host);
        word = word.charAt(0).toUpperCase() + word.slice(1);
        console.log('word',word);
        var request = client.request('GET', '/define.php?term='+word, {
            'host': host
        });
        request.on('response', function(response) {
            response.setEncoding('utf8');

            var body = "";
            response.on('data', function(chunk) {
                body = body + chunk;
            });

            response.on('end', function() {

                // now we have the whole body, parse it and select the nodes we want...
                var handler = new htmlparser.DefaultHandler(function(err, dom) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        //console.log('dom',dom)
                        var meaning = select(dom, '.meaning');
                        //console.log('meaning', meaning[0].children[0].data);
                        if (meaning){
                        meaning = meaning[0].children[0].data;
                    }
                    else meaning = "The definition for " + word + " is not defined";
                        meaning = meaning.replace(/\W/g, ' ');
                        console.log(meaning);
                        echoResponse.response.outputSpeech.text = meaning;
                        echoResponse.response.card.content = meaning;
                        sendResponse();

                    }
                });
                var parser = new htmlparser.Parser(handler);
                parser.parseComplete(body);
            });
        });
        request.end();
    }

    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};

            echoResponse.response.outputSpeech.type = "PlainText"
            echoResponse.response.outputSpeech.text = "ok"
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            // console.dir(theRequest, {
            //     depth: 5
            // });
            if (theRequest.request.type == 'IntentRequest') {
                word = theRequest.request.intent.slots.Word.value;
                //console.log("word", word);
                echoResponse.response.card = {};
                echoResponse.response.card.type = "Simple";
                echoResponse.response.card.title = "Urban Dictionary";
                echoResponse.response.card.subtitle = word;
                echoResponse.response.card.content = "";
                echoResponse.sessionAttributes = {};
                echoResponse.response.shouldEndSession = "false";
                getDefinition(word);
            } else
                sendResponse();
        });
    } else {
        echoResponse = {};
        sendResponse();
    }
}).listen(3028); //Put number in the 3000 range for testing and 443 for production
