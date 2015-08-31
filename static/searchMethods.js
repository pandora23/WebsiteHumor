var main = function(){
	
	
	
	
};


var getSiteList = function(string){
	
	var search_type = "Web";
	var query = string;
	var skipN = 0;
	
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
                console.log(data);//parse data...                
            }
        });
	
};


var getSiteData = function(url){
	
	//try a worker so I can hopefully time him outerHeight
    var siteWorker = new Worker('siteProcessingWorker.js');
	siteWorker.onmessage = function(e) {
      console.log(e.data);
    };
    siteWorker.onerror = function(e) {
      alert('Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
    };

    //start the worker
    worker.postMessage({'cmd':   'getPage', 
                        'value': url
                      });
	
};



$(document).ready(main);