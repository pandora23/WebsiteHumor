var main = function(){
	//add listeners here
};

var portNum = 8416;
var dat = Object;
var done= false;
var count=0;

//var whichQuery = 0;
var p1UrlList = [];

var hitsP1 = [];
var hitsP2 = [];
var hitsM1 = [];
var hitsM2 = [];

var dataP1 = [];
var dataP2 = [];
var dataM1 = [];
var dataM2 = [];

var ngWidth = -1;

//for a hack
var mz = "";

var initialized = false;
var idNumber=-1;
var processed = 0;
var A = "";
var d = 3;
var m2="";
var donePulling = false;

var enough = false;

//things that don't get reset
var urlCount=-1;


var initializeDataOnServer = function(){
	
	$.ajax({
				type: 'GET',
				url: 'http://localhost:'+portNum+'/initialize/',
				//data : {dataInitialized: initialized, idNum: idNumber},
				success: function(data){
					idNumber=data['idNum'];
					console.log("IDNUM: " + idNumber);
					initialized=data['initialized'];
					console.log(initialized);
					
					continueRunning();

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
						alert("Status: " + textStatus); alert("Error: " + errorThrown); 
					}       
			});
};

var clearData = function(){
	//$('#runButton').attr('disabled','enabled');
	//$('#runButton').disabled(false);
	
	dat = Object;
	done= false;
	count=0;
	//var whichQuery = 0;
	p1UrlList = [];

	hitsP1 = [];
	hitsP2 = [];
	hitsM1 = [];
	hitsM2 = [];

	dataP1 = [];
	dataP2 = [];
	dataM1 = [];
	dataM2 = [];

	//ngDist = 3;

	//for a hack
	mz = "";

	initialized = false;
	idNumber=-1;
	processed = 0;
	A = "";
	d = 3;
	m2="";
	donePulling = false;
	//urlCount=10;
	enough = false;
	$('.form5').val('');
	
	/* $('.form1').val()='est';
	$('.form2').val();
	$('.form3').val();
	$('.form4').val();
	$('.formE').val();
	$('.formD').val(); */
	
};
var runExperiment= function(){
	
	
	donePulling = false;
	
	A = $('.form5').val();
	var p1 = $('.form1').val();
	var p2 = $('.form2').val();
	var m1 = $('.form3').val();
	m2 = $('.form4').val();
	d = $('.formD').val();
	ngWidth = $('.formE').val();
	urlCount = $('.formF').val();
	
	//greyout button
	//$('#runButton').disabled(true);
	
	
	
	$(".Freq1").text("Most frequent words and bigrams that co-occur with \'"+ A +"\' given \'" + p1 + "\':");
	$(".Freq2").text("Most frequent words and bigrams that co-occur with \'"+ A +"\' given \'" + p2 + "\':");
	$(".Freq3").text("Most frequent words and bigrams that co-occur with \'"+ A +"\' given \'" + m1 + "\':");
	$(".Freq4").text("Most frequent words and bigrams that co-occur with \'"+ A +"\' given \'" + m2 + "\':");
	
	getSiteList(p1,hitsP1);
	getSiteList(p2,hitsP2);
	getSiteList(m1,hitsM1);
	getSiteList(m2,hitsM2);
	
	initializeDataOnServer();
	
	
	
	
};

var continueRunning = function(){
	setTimeout(function(){
		console.log("LISTCHECK2");
		console.log(hitsP1);
		pullAllDataUsingSiteList(hitsP1, "P1");
		pullAllDataUsingSiteList(hitsP2, "P2");
		pullAllDataUsingSiteList(hitsM1, "M1");
		pullAllDataUsingSiteList(hitsM2, "M2");

	}, 5000);
	
}


function pullAllDataUsingSiteList(urlList, whichQuery){
	
	//move to next query
	
	
	console.log("URLLIST");
	console.log(urlList);
	
	//var dataFromSites = []
	
	//CHANGE BACKn ONCE DONE DEVELOPING
	for(var i = 0; i < urlCount*2.5; i++){
		console.log("hit");
		console.log(urlList[i]);
		var dataPoint = ""
		getSiteData(urlList[i], whichQuery);
		
	};
	
	
	//whichQuery++;
	

};

function setDataPoint(dataPoint, whichList, urlX){
	
	
	
		//console.log(urlCount);
		if( dataP1.length >= urlCount &&
			dataP2.length >= urlCount &&
			dataM1.length >= urlCount &&
			dataM2.length >= urlCount &&
			donePulling == false){
					donePulling = true;
					console.log("LASTTEXTGRABBED");
					getFrequencies();
				}
		else{
			console.log("setting " + whichList);
	
			if(whichList != 'fail'){
				
				console.log("NextPoint "+dataPoint)
				if(dataPoint != []){
					$('.currentPart').text(whichList);
					$('.allTextP1').append($('<li>').text(dataPoint));
					
					if(whichList==="P1"){
						$('.resultsListP1').append($('<li class=\"greyText\">').text(urlX));
						if(dataP1.length <= urlCount){
						dataP1.push(dataPoint);
						}
					}
					if(whichList==="P2"){
						$('.resultsListP1').append($('<li>').text(urlX));
						if(dataP2.length <= urlCount){
						dataP2.push(dataPoint);
						}	
					}
					if(whichList==="M1"){
						$('.resultsListP1').append($('<li>').text(urlX));
						if(dataM1.length <= urlCount){
						dataM1.push(dataPoint);
						}
					}
					if(whichList==="M2"){
						$('.resultsListP1').append($('<li>').text(urlX));
						if(dataM2.length <= urlCount){
						dataM2.push(dataPoint);
						}
					
					}
				}
				
				/* last = whichList;
				if(last != whichList){
					$('.resultsListP1').append($('<li>').text(whichList))
				} */
				$('.allTextP1').scrollTop($('.allTextP1').scrollHeight-1);
				$('.resultsListP1').scrollTop($('.resultsListP1').scrollHeight);
				
				//$('.resultsListP1').animate({ scrollTo: $('.resultsListP1').scrollHeight});
				//$('.allTextP1').animate({ scrollTo: $('.allTextP1').scrollHeight});
					
				}
	}
	
	
	
};


function getFrequencies(){
		
	$.ajax({
            type: 'POST',
            url: 'http://localhost:'+portNum+'/freqFinder/',
            data : {'idNum':idNumber, 'ambiguous':A, 'distance':d, 'ngWidth':ngWidth},
            success: function(data){
				displayCounts(data);
				displayCorrelationAndVisualize(data);
				
            },
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    alert("Status: " + textStatus); alert("Error: " + errorThrown); 
                }       
        });	
		
		
};

function displayCorrelationAndVisualize(data){
	
	c1x = data['C1X']['score'][0].toFixed(3);
	$('#c1x').text(c1x.toString());
	c1y = data['C1Y']['score'][0].toFixed(3);
	$('#c1y').text(c1y.toString());
	c2x = data['C2X']['score'][0].toFixed(3);
	$('#c2x').text(c2x.toString());
	c2y = data['C2Y']['score'][0].toFixed(3);
	$('#c2y').text(c2y.toString());
	
	draw(c1x,c1y,c2x,c2y);
	//c1x = data['c1x']['score'];
}
function displayCounts(data){
	console.log(data);
	
	//grab the top frequencies
	var countData = [data['P1Freq'],data['P2Freq'],data['M1Freq'],data['M2Freq']];
	
	var numToDisplay = 20
	//display the top frequencies
	for(var i = 0; i <= 3; i++){
		var mostFrequentString = "";
		for(var j = 0; j < numToDisplay; j++){
			mostFrequentString = mostFrequentString + "("+countData[i][j][0]+","+countData[i][j][1].toFixed(3)+"), ";
		}
		$('.Freq'+(i+1)+'List').text(mostFrequentString);
	}
	
}



function getSiteList(string, hits){
	
	var search_type = "Web";
	var query = string;
	query = query.replace(" ","+");
	console.log(query);
	var skipN = 0;
	var urlList = [];
	
	//REPLACE BY USER INPUT
	var numHits = urlCount*3;
	var numRequests = Math.floor(numHits/50) + 1;
	console.log("NumAPIRequestsBING: " + numRequests);
	
	
	<!--query-->
	var url = 'https://api.datamarket.azure.com/Data.ashx/Bing/Search/'+search_type+'?Query=%27'+query+'%27&$top=50&$format=json&$skip='+skipN;

	
	$.ajax({
            type: 'GET',
            url: url,
            dataType: "json", 
            context: this,
            beforeSend: function(xhr){
                //base64 encoded: ignore:key
				var key1 = ':sbldpRy9UbG+ANqo3ErDxV/wmR42dqRcw3scWmk5QqM';
				var key1 = base64_encode(key1);
                xhr.setRequestHeader('Authorization', 'Basic '+key1);
            },
            success: function(data,status){
                //parse data...   
				for(var i = 0; i < data.d.results.length; i++){
					hits.push(data.d.results[i].Url);
					console.log(data.d.results[i].Url);
					console.log(hits[i]);
				}

            }
        });
	
	
};




function getSiteData(urlX, whichList){
	

	console.log("ZZZ" + urlX);
	console.log("Which " + whichList);
	//append to website 
	
	var dist = 3;
	var enough = false;
	
	if(whichList === "P1"){
		console.log("another");
		
		var n = dataP1.length;
		console.log(n);
		
		if(n >= urlCount){
			enough = true;
		}
	}
	if(whichList === "P2"){
		var n = dataP2.length;
		if(n >= urlCount){
			enough = true;
		}
	}
	if(whichList === "M1"){
		console.log("M1 n: " + dataM1.length)
		var n = dataM1.length;
		if(n >= urlCount){
			enough = true;
		}
	}
	if(whichList === "M2"){
		var n = dataM2.length;
		if(n >= urlCount){
			enough = true;
		}
	}
	
	
	if(enough == false){
		$.ajax({
				type: 'POST',
				url: 'http://localhost:'+portNum+'/urlGrab/',
				data : {texts : urlX, which: whichList, AmbiguousWord: A, dataInitialized: initialized, idNum: idNumber, dist: d},
				success: function(data){
					idNumber=data['idNum'];
					console.log("IDNUM: " + idNumber);
					
					initialized=data['initialized'];
					console.log(initialized);
					
					setDataPoint(""+data['texts'], ""+data['which'], urlX);

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
						alert("Status: " + textStatus); alert("Error: " + errorThrown); 
					}       
			});
	}
	
};


var draw = function(c1x,c1y,c2x,c2y){
	
		var canvas = document.getElementById("canvas1");
		if (canvas.getContext) {
			var ctx = canvas.getContext("2d");
			
			var offSetX = 50;
			var offSetY = 100
			
			//
			var width = canvas.width - offSetX;
			var height = canvas.height - offSetY;
			
			//set so it starts at origin
			var offSetY = 0;
			
			
			//draw axis
			ctx.beginPath();
			ctx.strokeStyle = '#0000ff'
			//(0,0)
			ctx.moveTo(offSetX+1,height+offSetY);
			//line to (0,1)
			ctx.lineTo(offSetX+1,offSetY);
			
			//(0,0)
			ctx.moveTo(offSetX,height+offSetY);
			//line to (1,0)
			ctx.lineTo(width+offSetX,height+offSetY);
			
			ctx.closePath();
			ctx.stroke();
			
			
			//label axis
			ctx.font = "12px Arial";
			ctx.fillText("Correlation with",0,10);
			ctx.fillText("Meaning Y",0,35);
			ctx.fillText("Correlation with Meaning X",width-150,height+10);
			
			
			
			//color 
			var classVal = $("input[name=class]:checked").val();
			console.log(classVal);
			ctx.beginPath();
			if(classVal === 'NonJoke'){
				ctx.strokeStyle = '#ff0000';
			}
			else if(classVal === 'Joke'){
				ctx.strokeStyle = '#00ff00';
			}
			else{
				ctx.strokeStyle = '#0000ff';
			}
			
			//draw vector
			//var linePath2 = new Path2D();
			//ctx.beginPath();
			ctx.moveTo(c1x*width+offSetX,height-c1y*height+offSetY);
			ctx.lineTo(c2x*width+offSetX,height-c2y*height+offSetY);
			ctx.closePath();
			ctx.stroke();
			
			//draw arrowhead
			canvas_arrow(ctx,c1x*width,c1y*height,c2x*width,c2y*height, height, offSetX, offSetY);
			
		  }
		  
		    
	}

//method obtained from stackoverflow.com
//method obtained from stackoverflow.com
function canvas_arrow(context, fromx, fromy, tox, toy, height, offSetX, offSetY){
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,(tox-fromx));
	//var linePath3=new Path2D();
	context.beginPath();
    context.moveTo(fromx+offSetX, height-1-fromy+offSetY);
    context.lineTo(tox+offSetX, height-1-toy+offSetY);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6)+offSetX,height-1-(toy-headlen*Math.sin(angle-Math.PI/6))+offSetY);
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6)+offSetX,height-1-(toy-headlen*Math.sin(angle+Math.PI/6))+offSetY);
	context.lineTo(tox+offSetX, height-1-toy+offSetY);
	contex.closePath();
	context.stroke();
	}

var base64_encode = function(data) {
  // http://kevin.vanzonneveld.net
  // +   original by: Tyler Akins (http://rumkin.com)
  // +   improved by: Bayron Guevara
  // +   improved by: Thunder.m
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Pellentesque Malesuada
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Rafal Kukawski (http://kukawski.pl)
  // *     example 1: base64_encode('Kevin van Zonneveld');
  // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
  // mozilla has this native
  // - but breaks in 2.0.0.12!
  //if (typeof this.window['btoa'] == 'function') {
  //    return btoa(data);
  //}
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = "",
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

};
	
$(document).ready(main);