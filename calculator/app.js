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
    console.log('something received');
    //echoResponse = {};
    //sendResponse();
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
            echoResponse.response.outputSpeech.text = "Say a number"
            echoResponse.response.shouldEndSession = "false";
            echoResponse.sessionAttributes = {'total': 0,'lastvalue': 0};
            theRequest = JSON.parse(jsonString);
            console.dir(theRequest, {depth:10});

            if (theRequest.request.type == 'IntentRequest') {
                if(typeof theRequest.request.intent.slots.myNumber !== 'undefined'){
                myNumber = theRequest.request.intent.slots.myNumber.value;
                total = theRequest.session.attributes.total;
                total = Number(total) + Number(myNumber);
                echoResponse.response.outputSpeech.text = "I heard the number " + myNumber + ' for a total of ' + total;
                }
                
                // echoResponse.response.card = {};
                // echoResponse.response.card.type = "Simple";
                // echoResponse.response.card.title = "Template Title";
                // echoResponse.response.card.subtitle = "Template SubTitle";
                // echoResponse.response.card.content = myNumber;
                echoResponse.sessionAttributes = {'total': total,'lastvalue': myNumber};
                echoResponse.response.shouldEndSession = "false";
            }
            sendResponse();
        });
    } 
}).listen(3002);