teamtools.initStripe = function initStripe(apiKey){
	this.gateway = new teamtools.Stripe(apiKey);
}

teamtools.Stripe = function Stripe(apiKey){

	this.ready = false;
	this.queue = new funcQueue();

	teamtools.Gateway.call(this, 'Stripe', 'https://js.stripe.com/v2/', function initStripe(){
		window.Stripe.setPublishableKey(apiKey);
		this.ready = true;
		this.queue.execAll();
	}.bind(this));
};

teamtools.Stripe.prototype.cardType = function cardType(cardNumber){
	return window.Stripe.cardType(cardNumber);
}

teamtools.Stripe.prototype.validateCVC = function validateCVC(cvc){
	return window.Stripe.card.validateCVC(cvc);
}

teamtools.Stripe.prototype.validateCardNumber = function validateCardNumber(cardNumber){
	return window.Stripe.card.validateCardNumber(cardNumber);
}

teamtools.Stripe.prototype.validateExpiry = function validateExpiry(date){
	return window.Stripe.card.validateExpiry(date);
}

teamtools.Stripe.prototype.createToken = function createToken(ccObject, callback){

	if(!this.ready){
		this.queue.addFunction(arguments, this);
		return;
	}

	return window.Stripe.card.createToken(ccObject, function createTokenCallback(status, response){

		if(status != 200){
			callback(response.error);
			return;
		}

		callback(null, response.id);
	});
}