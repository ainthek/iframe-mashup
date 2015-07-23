function addTopicListener(w,topic,callback){
	w.addEventListener("message",function(evt){
		var data;
		if(topic===(data=JSON.parse(evt.data)))
	});
}