# Teamtools Client SDK

#### Installation

Teamtools Client SDK can be installed by adding script tag to your html file:

```html
<script type="text/javascript" src="http://resources.teamtools.io/tt.js"></script>
```
To prevent problems with some older browsers, we recommend putting the script tag in the `<head>` tag of your page, or as a direct descendant of the `<body>` at the end of your page.

#### Initialisation

Initialisation for events:

```javascript
 teamtools.init(accessToken, end_user_email, key)
```

Initialisations for gateways:

```javascript
 teamtools.initStripe(stripe_client_api_key)
```
```javascript
 teamtools.initBraintree(braintree_client_api_key)
```


### Tracking events

When you need to track event you need to call
```javascript
 teamtools.track(event_name, metadata)
```

### Generate credit card token

Converting credit card to safe token will only be possible after gateway initialisation
```javascript
 teamtools.gateway.createToken(cc_object, callback)
```

### Credit card object(cc_object) example

Only number, exp_month and exp_year are required.

```json
{
  "number": "4242424242424242",
  "exp_month": 12,
  "exp_year": 2016,
  "cvc": 832,
  "name": "Sherlock Holmes",
  "address_line1": "221B Baker Street",
  "address_line2": "",
  "address_city": "London",
  "address_state": "",
  "address_zip": "NW1 6XE",
  "address_country": "England"
}
```
