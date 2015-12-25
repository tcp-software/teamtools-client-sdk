teamtools.Gateway = function Gateway(name, link, initFunction){

	//Subscribe to object create
	if(!window[name]){

		var scriptGateway = document.createElement('script');

        scriptGateway.setAttribute("type","text/javascript");
        scriptGateway.setAttribute("src", link);
        scriptGateway.onload = initFunction;

        document.body.appendChild(scriptGateway);
	}else{
		initFunction();
	}

}
