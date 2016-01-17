# Sesame

Hook up your old-school gate telephone entry system in your apartment complex to the internet! You can let people in automatically or have them create a token via text message or [yo](http://justyo.co) or something!

## Requirements

* Paid [Twilio](http://twilio.com) number that will be called when a guest dials your name in the call box
* Server capable of running/deploying [node.js](http://nodejs.org) application

## Usage

1. Create a `config.json` file in the root directory. See `config-defaults.json` to see example config keys.
2. Deploy the node.js application [however](https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps) [you](http://thatextramile.be/blog/2012/01/hosting-a-node-js-site-through-apache/) [want](https://blog.risingstack.com/operating-node-in-production/).
3. Follow one (or more if you want more auth schemes) of these to let people in when they dial:

### Letting anybody in without checking

* Have Twilio hit your application called by setting the **Voice > Request URL** to `http://[SESAME_URL]/accept`

### Forcing guests to create a token in order to be let in

* Have Twilio hit your application called by setting the **Voice > Request URL** to `http://[SESAME_URL]/tokens/consume`
* Guests generate tokens by:
    * **Texting your Twilio number:** Set **SMS & MMS > Request URL** to  `http://[SESAME_URL]/tokens/create`
    * **Sending a [yo](http://justyo.co):** Create a yo account, set its **Edit Profile > Callback** to  `http://[SESAME_URL]/tokens/create`
    * Hitting `http://[SESAME_URL]/tokens/create` with any other service

#### Sending SMS or Yo notifications when a token is consumed

Add a notify query param to your twilio **Voice > Request URL**: 

* Yo: `http://[SESAME_URL]/tokens/consume?notify=yo:<YO_API_KEY>:<YO_RECIPIENT>`
* SMS: `http://[SESAME_URL]/tokens/consume?notify=sms:<PHONE_NUMBER>`

### Approving each access request manually using [Duo mobile](http://duosecurity.com)

It works, but documentation WIP
