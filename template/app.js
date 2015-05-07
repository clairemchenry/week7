var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};


https.createServer(options, function(req, res) {
    function sendResponse() {
        myResponse = JSON.stringify(echoResponse);
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            console.dir(jsonString, {depth: 5});
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};

            echoResponse.response.outputSpeech.type = "PlainText"
            echoResponse.response.outputSpeech.text = "Say something"
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            if (theRequest.request.type == 'IntentRequest') {
                choice = theRequest.request.intent.slots.Choice.value;
                echoResponse.response.outputSpeech.text = "I heard the choice " + choice;
                echoResponse.response.card = {};
                echoResponse.response.card.type = "Simple";
                echoResponse.response.card.title = "Template Title";
                echoResponse.response.card.subtitle = "Template SubTitle";
                echoResponse.response.card.content = choice;
                echoResponse.sessionAttributes = {};
                echoResponse.response.shouldEndSession = "false";
            }
            sendResponse();
            console.dir(echoResponse, {depth: 5});

        });
    } else {
        sendResponse();
    }
}).listen(3030); //Put number in the 3000 range for testing and 443 for production
