var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};

var compliments = [];
compliments.push("You have very smooth hair.");
compliments.push("You are quite strapping.");
compliments.push("I really like your socks");
compliments.push("If I freeze, it is not a bug, I was stunned by your beauty.")


function getRandomTruth() {
    return truths[Math.floor(Math.random() * truths.length)];
}

var dares = [];
dares.push("Eat a mouthful of crackers and try to whistle.");
dares.push("Go outside aand sing a clip of your favorite Disney song at the top of your lungs.");
dares.push("Say the alphabet backwards in a British accent.");
dares.push("Spin around ten times and try and walk in a straight line.")
dares.push("Let the person next to you text anyone on your phone.")


function getRandomDare() {
    return dares[Math.floor(Math.random() * dares.length)];
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
            echoResponse.response.outputSpeech.text = "Do you want truth or dare?"
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            console.log('JSON', theRequest.request);
            if (typeof theRequest.request.intent !== 'undefined') {
                choice = theRequest.request.intent.slots.Choice.value;
                
                if(choice === "truth"){
                    truth = getRandomTruth();
                    dare = getRandomDare();
                    echoResponse.response.outputSpeech.text = truth; 
                    //echoResponse.response.outputSpeech.text = "you said " + choice;
                    // echoResponse.response.card = {}
                    // echoResponse.response.card.type = "PlainText";
                    // echoResponse.response.card.title = choice;
                    // echoResponse.response.card.subtitle = choice;
                    // echoResponse.response.card.content = choice;
                    echoResponse.response.shouldEndSession = "true";
            }
      if(choice === "dare"){
                    dare = getRandomDare();
                    echoResponse.response.outputSpeech.text = dare; 
                    //echoResponse.response.outputSpeech.text = "you said " + choice;
                    // echoResponse.response.card = {}
                    // echoResponse.response.card.type = "PlainText";
                    // echoResponse.response.card.title = choice;
                    // echoResponse.response.card.subtitle = choice;
                    // echoResponse.response.card.content = choice;
                    echoResponse.response.shouldEndSession = "true";
            }
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
