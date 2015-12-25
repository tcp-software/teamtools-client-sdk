teamtools.initBraintree = function initBraintree(apiKey){
	this.gateway = new teamtools.Braintree(apiKey);
}

teamtools.Braintree = function Braintree(apiKey){

	this.ready = false;
	this.queue = new funcQueue();

	teamtools.Gateway.call(this, 'braintree', 'https://js.braintreegateway.com/v2/braintree.js', function initBraintree(){
		this.client = new window.braintree.api.Client({clientToken: apiKey})
		this.ready = true;
		this.queue.execAll();
	}.bind(this));
};

teamtools.Braintree.prototype.createToken = function createToken(ccObject, callback){

	ccObject.expirationMonth = ccObject.exp_month;
	ccObject.expirationYear = ccObject.exp_year;
	ccObject.cvv = ccObject.cvc;
	ccObject.cardholderName = ccObject.name;

	if(ccObject.address_zip){
		ccObject.billingAddress = {
			postalCode: ccObject.address_zip
		}
	}

	delete ccObject.cvc;
	delete ccObject.exp_month;
	delete ccObject.exp_year;
	delete ccObject.name;
	delete ccObject.address_zip;

	if(!this.ready){
		this.queue.addFunction(arguments, this);
		return;
	}

	return this.client.tokenizeCard(ccObject, callback);
}