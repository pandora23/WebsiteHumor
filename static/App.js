var main = function(){
	//add listeners here
};

var portNum = 8204;
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

var ngDist = 3;

//for a hack
var mz = "";

var processed = 0;
var A = "";
var d = 3;
var m2="";
var donePulling = false;
var urlCount=5;
var enough = false;

var runExperiment= function(){
	
	donePulling = false;
	
	A = $('.form5').val();
	var p1 = $('.form1').val();
	var p2 = $('.form2').val();
	var m1 = $('.form3').val();
	m2 = $('.form4').val();
	ngDist = $('.formE').val();
	d = $('.formD').val();
	
	
	
	
	$(".Freq1").text("Most frequent words that co-occur with "+ A +" given " + p1 + ":");
	$(".Freq2").text("Most frequent words that co-occur with "+ A +" given " + p2 + ":");
	$(".Freq3").text("Most frequent words that co-occur with "+ A +" given " + m1 + ":");
	$(".Freq4").text("Most frequent words that co-occur with "+ A +" given " + m2 + ":");
	
	
	
	
	
	
	
	//timeout if this does not work, have to do some work with try/catch (ONLY PULLING 50 SITES, REFACTOR TO PULL N SITES)
	
	
	
	getSiteList(p1,hitsP1);
	getSiteList(p2,hitsP2);
	getSiteList(m1,hitsM1);
	getSiteList(m2,hitsM2);
	
	
	
	
	/* var hitsP2 = getSiteList(p2,myCallback);
	var hitsM1 = getSiteList(m1,myCallback);
	var hitsM2 = getSiteList(m2,myCallback); */
	
	//replace with callback
	
	setTimeout(function(){
		console.log("LISTCHECK2");
		console.log(hitsP1);
		pullAllDataUsingSiteList(hitsP1, "P1");
		pullAllDataUsingSiteList(hitsP2, "P2");
		pullAllDataUsingSiteList(hitsM1, "M1");
		pullAllDataUsingSiteList(hitsM2, "M2");

	}, 5000);
	
	
};

/* function grabTexts(){
	setTimeout(function(){
		console.log("LISTCHECK2");
		console.log(hitsP1);
		
		
		pullAllDataUsingSiteList(hitsP1, "P1");
		pullAllDataUsingSiteList(hitsP2, "P2");
		pullAllDataUsingSiteList(hitsM1, "M1");
		pullAllDataUsingSiteList(hitsM2, "M2");

	}, 1000);
}; */
/* function waitForFinish(){
	length = dataP1.length;
	done = false;
	
	while(done==false){
		setTimeout(function(){
			prevLength = length;
			length = dataP1.length;
			if(length==prevLength){
				done==true;
			}
		}, 2000);
	}

	for(dat in dataP1){
		$('.allTextP1').append($('<li>').text(dat));
	}
};
 */

function pullAllDataUsingSiteList(urlList, whichQuery){
	
	//move to next query
	
	
	console.log("URLLIST");
	console.log(urlList);
	
	//var dataFromSites = []
	
	//CHANGE BACKn ONCE DONE DEVELOPING
	for(var i = 0; i < urlCount*3; i++){
		console.log("hit");
		console.log(urlList[i]);
		var dataPoint = ""
		getSiteData(urlList[i], whichQuery);
		
	};
	
	
	//whichQuery++;
	

};

function setDataPoint(dataPoint, whichList, urlX){
	
	
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
		$('.allTextP1').scrollTop($('.allTextP1').scrollHeight);
		$('.resultsListP1').scrollTop = $('.resultsListP1').scrollHeight;
		
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
	}
	
	
	
};


function getFrequencies(){
		
	$.ajax({
            type: 'GET',
            url: 'http://localhost:'+portNum+'/freqFinder/',
            //data : {site : urlX, which: whichList, AmbiguousWord: A}
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
	
	c1x = data['C1X']['score'];
	$('#c1x').text(c1x.toString());
	c1y = data['C1Y']['score'];
	$('#c1y').text(c1y.toString());
	c2x = data['C2X']['score'];
	$('#c2x').text(c2x.toString());
	c2y = data['C2Y']['score'];
	$('#c2y').text(c1y.toString());
	//c1x = data['c1x']['score'];
}
function displayCounts(data){
	console.log(data);
	
	//grab the top frequencies
	var countData = [data['P1Freq'],data['P2Freq'],data['M1Freq'],data['M2Freq']];
	
	var numToDisplay = 50
	//display the top frequencies
	for(var i = 0; i <= 3; i++){
		var mostFrequentString = "";
		for(var j = 0; j < numToDisplay; j++){
			mostFrequentString = mostFrequentString + ", " + countData[i][j][0];
		}
		$('.Freq'+(i+1)+'List').text(mostFrequentString);
	}
	
}

/* var myCallback = function(data, hits){
	
		
		for(var i = 0; i < data.d.results.length; i++){
			hits.push("" + data.d.results[i].Url);
			console.log(data.d.results[i].Url);
		};
		console.log('List');
		console.log(urlList);
		
		//return urlList;
            
}; */



function getSiteList(string, hits){
	
	var search_type = "Web";
	var query = string;
	query = query.replace(" ","+");
	console.log(query);
	var skipN = 0;
	var urlList = [];
	
	//REPLACE BY USER INPUT
	var numHits = urlCount*2;
	var numRequests = Math.floor(numHits/50) + 1;
	console.log("NumAPIRequestsBING: " + numRequests);
	
	
	<!--query-->
	var url = 'https://api.datamarket.azure.com/Data.ashx/Bing/Search/'+search_type+'?Query=%27'+query+'%27&$top=40&$format=json&$skip='+skipN;

	
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
	
		
	
	/* else if(whichQuery===1){
		$('.resultsListP2').append($('<li>').text(urlX));
	}
	else if(whichQuery===2){
		$('.resultsListMX').append($('<li>').text(urlX));
	}
	else{
		$('.resultsListMY').append($('<li>').text(urlX));
	} */
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
				data : {texts : urlX, which: whichList, AmbiguousWord: A},
				success: function(data){
					setDataPoint(""+data['texts'], ""+data['which'], urlX);

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
						alert("Status: " + textStatus); alert("Error: " + errorThrown); 
					}       
			});
	}
};


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