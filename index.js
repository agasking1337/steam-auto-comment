var SteamUser = require('steam-user');
var SteamCommunity = require('steamcommunity');
var SteamTotp = require('steam-totp');
var TradeOfferManager = require('steam-tradeoffer-manager'); 
var fs = require('fs');

var firstClient = new SteamUser();

// Managers
var firstManager = new TradeOfferManager({
   "steam": firstClient, 
   "domain": "example.com", 
   "language": "en" 
});

// Communities
var firstCommunity = new SteamCommunity();

// Config
var config = JSON.parse(fs.readFileSync('./config.json'));

var firstLogonOptions = {
   "accountName": config.bots.firstaccount.username,
   "password": config.bots.firstaccount.password,
   "twoFactorCode": SteamTotp.getAuthCode(config.bots.firstaccount.shared_secret)
};

// Logging in...
firstClient.logOn(firstLogonOptions);

firstClient.on('loggedOn', () => {
   console.log('Logged In!');
   firstClient.setPersona(SteamUser.Steam.EPersonaState.Online);
   firstClient.gamesPlayed(["Testing +REP BOT",440,570]); 
});

firstClient.on('webSession', (sessionid, cookies) => {
firstManager.setCookies(cookies);
firstCommunity.setCookies(cookies);
});


firstClient.on('friendRelationship', function(steamID, relationship) {
 
     if (relationship == SteamUser.Steam.EFriendRelationship.RequestRecipient) {
         firstClient.addFriend(steamID);
         console.log(" ");
         console.log("Accepted friend request from: " + steamID);
         firstClient.chatMessage(steamID, "Welcome To My +REP Bot, type !help to get started!");
     }
     });



firstClient.on("friendMessage", function(steamID, message) {
if (message == "!help") {
firstClient.chatMessage(steamID, "Type !comment for +rep on your profile");
}
});


firstClient.on("friendMessage", function(steamID, message) {
  if (message == "!comment") {
    firstClient.chatMessage(steamID, "OK i comment you profile !")
    firstCommunity.postUserComment(steamID, "+REP")
  }
});
