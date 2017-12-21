function createWidget(config) {

	var Util = {
		extendObject: function(a, b) {
			for(prop in b){
				a[prop] = b[prop];
			}
			return a;
		},
		proto: 'https:' == document.location.protocol ? 'https://' : 'http://'
	}

	let obj = JSON.parse( atob( config.scheduleId) );

	config.cityUrlName = obj.cityUrlName;
	config.clubNetId = obj.clubNetId;
	config.clubId = obj.clubId;

	var options = Util.extendObject({
		domain: "wj.sportpriority.com"
	}, config);
	options.widget_url = [Util.proto, options.domain].join("");
    options.widget_url += `?cityUrlName=${options.cityUrlName}&clubNetId=${options.clubNetId}&clubId=${options.clubId}&theme=${options.theme}&room=${options.room}`;

	Widget = {
		created: false,
		widgetElement: null,
		show: function() {
			if (this.created)
				return;
			this.widgetElement = document.createElement('div');
			this.widgetElement.setAttribute('id', 'widget_container');
			this.widgetElement.innerHTML = '<iframe id="widget_iframe" src="' + options.widget_url + '" scrolling="no" name="target" width="100%" height="200" frameborder="0"></iframe>';

			document.querySelector('#' + config.id).appendChild(this.widgetElement);
			this.widgetElement.style.display = 'block';
			this.created = true;
		}
	}

	Widget.show();
}

function listener(event) {

  if(event.data.origin === 'schedule'){
  	if(scheduleConnect) clearInterval(scheduleConnect);
  	if(event.data.height){
  		document.getElementById('widget_iframe').height = event.data.height;
  	}
  }
  
}
window.addEventListener("message", listener);


createWidget(scheduleApp);
var win = window.frames.target;
var scheduleConnect = setInterval(function(){
    win.postMessage('schedule','*');
},500);