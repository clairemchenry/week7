var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};

var truths = [];
truths.push("I am jealous of all the people that have not met you!");
truths.push("If you keep talking you will someday say something intelligent.");
truths.push("Before you came along, we were hungry. Now we are all fed up.");
truths.push("If I freeze, it is not a bug, I was stunned by your beauty.")
truths.push("The sound of your voice sends tingles of joy down my back.")
truths.push("I would really enjoy a road trip with you!")



function getRandomTruth() {
    return truths[Math.floor(Math.random() * truths.length)];
}




https.createServer(options, function(req, res) {
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            console.dir(jsonString, {
                depth: 5
            });
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};


            echoResponse.response.outputSpeech.type = "PlainText"
        
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            console.log('JSON', theRequest.request);
            truth = getRandomTruth();
                   
                    echoResponse.response.outputSpeech.text = truth;
            if (typeof theRequest.request.intent !== 'undefined') {
                choice = theRequest.request.intent.slots.Choice.value;
                
                
                    //truth = getRandomTruth();
                   
                    echoResponse.response.outputSpeech.text = choice + " " + truth; 
                    //echoResponse.response.outputSpeech.text = "you said " + choice;
                    // echoResponse.response.card = {}
                    // echoResponse.response.card.type = "PlainText";
                    // echoResponse.response.card.title = choice;
                    // echoResponse.response.card.subtitle = choice;
                    // echoResponse.response.card.content = choice;
                    echoResponse.response.shouldEndSession = "true";
            
      
            }
            myResponse = JSON.stringify(echoResponse);
            res.setHeader('Content-Length', myResponse.length);
            res.writeHead(200);
            res.end(myResponse);
            console.log('from post', myResponse);

        });
    } else {
        myResponse = JSON.stringify(echoResponse);
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }
}).listen(3017); //Put number in the 3000 range for testing and 443 for production
