// Set this to the ip address to the ipadress of your router to acess the webpage from the phone
var ipAddress = '192.168.1.1';
//var ipAddress = '127.0.0.1';  

var fs = require('fs');

var samplePage = fs.readFileSync('/node_app_slot/sample.html');

// Insert the ip address in the code in the page

samplePage = String(samplePage).replace(/<<ipAddress>>/, ipAddress);

var http = require('http');
var url = require('url');
var fs = require('fs');
var request = require('request');
var http = require('http');
http.post = require('http-post');

var flag = 0;

http.createServer(function (req, res) {
    var value;
    if ((req.url.indexOf('save_data') != -1)) {

		//read the URL to get the GET parameters
		urlObj = url.parse(req.url, true); // Parse the URL to geenrate the parts like hostname, pathname, query String etc..
		var queryObj = urlObj.query; // take the query object so that we can read what the user has sent
	
		// the name attribute of the input elements in sample.html file..... 
		console.log(queryObj.uid);
		console.log(queryObj.pid);
		console.log(queryObj.qty);
        console.log(queryObj.vid);

		//now to write it into a file
		fs.writeFile('/node_app_slot/datafile.txt',JSON.stringify(queryObj));
		
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('Your Product is Configured for One Touch shopping on EasyBuy...');
        //console.log(queryObj.uid);
        console.log('Data is saved in the file.......');
    }
	else if(flag==1 ){
         console.log('.............File is read and Sparkfun Server Updated..............');
		//read contents of the file into a string
		var dataString = fs.readFileSync('/node_app_slot/datafile.txt');

		//parse the string to create JSON obj
		var obj = JSON.parse(dataString);
        console.log(obj);

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end('Data read from file is<br/>Uid: '+obj.uid+'<br/>Pid: '+obj.pid+'<br/>Qty: '+obj.qty+'</br>Vid : '+obj.vid);
        //https://data.sparkfun.com/input/n1YroqQAR5UoXzZx6X6Q?private_key=Modgjb6GaDCDme9xjmjK&product=apples&quantity=2&userid=dev
        
        //request('http://data.sparkfun.com/input/n1YroqQAR5UoXzZx6X6Q?private_key=Modgjb6GaDCDme9xjmjK&productname='+obj.pid+'&quantity='+obj.qty+'&retailer='+obj.vid+'&userid='+obj.uid);
        
       //request('http://data.sparkfun.com/input/n1YroqQAR5UoXzZx6X6Q?private_key=Modgjb6GaDCDme9xjmjK&productname=Dove&quantity=3&retailer=Amazon&userid=gh');
        
        var abc= 'http://data.sparkfun.com/input/n1YroqQAR5UoXzZx6X6Q?private_key=Modgjb6GaDCDme9xjmjK&productname='+obj.pid+'&quantity='+obj.qty+'&retailer='+obj.vid+'&userid='+obj.uid;

        request(abc);
        //http.post('http://data.sparkfun.com/input/n1YroqQAR5UoXzZx6X6Q?private_key=Modgjb6GaDCDme9xjmjK&product')
        flag = 0;
	}  
    else {  
        //value = analogPin0.read();
        res.writeHead(200, {'Content-Type': 'text/html'});
        //res.end(JSON.stringify({lightLevel:getLux(value), rawValue:value}));
        res.end(samplePage);
    }
}).listen(1337);

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var myDigitalPin2 = new mraa.Gpio(2); //setup digital read on Digital pin #6 (D6)
myDigitalPin2.dir(mraa.DIR_IN); //set the gpio direction to input

periodicActivity(); //call the periodicActivity function

function periodicActivity() //
{
  var myDigitalValue =  myDigitalPin2.read(); //read the digital value of the pin
    if(myDigitalValue == 1)
    {
        console.log('Button is Pressed');
        var dataString = fs.readFileSync('/node_app_slot/datafile.txt');
        console.log(dataString);

		//parse the string to create JSON obj
		var obj = JSON.parse(dataString);
        flag = 1;
        request('http://192.168.2.15:1337/sample.html');
	//	res.writeHead(200, {'Content-Type': 'text/html'});
	//	res.end('Data read from file is<br/>Uid: '+obj.uid+'<br/>Pid: '+obj.pid+'<br/>Qty: '+obj.qty);  
        
    }
    
  setTimeout(periodicActivity,200); //call the indicated function after 1 second (1000 milliseconds)
}