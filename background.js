// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url' : 'https://www.google.com/accounts/OAuthGetRequestToken',
  'authorize_url' : 'https://www.google.com/accounts/OAuthAuthorizeToken',
  'access_url' : 'https://www.google.com/accounts/OAuthGetAccessToken',
  'consumer_key' : 'anonymous',
  'consumer_secret' : 'anonymous',
  'scope' : 'http://www.google.com/m8/feeds/',
  'app_name' : 'Sample - OAuth Contacts'
});


var contacts = null;
var people = null;

getContacts();

function setIcon() {
  if (oauth.hasToken()) {
    chrome.browserAction.setIcon({ 'path' : 'img/icon-19-on.png'});
  } else {
    chrome.browserAction.setIcon({ 'path' : 'img/icon-19-off.png'});
  }
};

function onContacts(text, xhr) {
  contacts = [];
  people = [];
  var data = JSON.parse(text);
  for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
    var contact = {
      'name' : entry['title']['$t'],
      'id' : entry['id']['$t'],
      'emails' : [],
      'phones' : []
    };

        var person = 
        {
            "name": entry['title']['$t'],
            "email": "",
            "phone": "",
            "url": "img/default_profile_2_normal.png"
        };


    if (entry['gd$email']) {
      var emails = entry['gd$email'];
      for (var j = 0, email; email = emails[j]; j++) {
        var em = email['address'];
        contact['emails'].push(em);
        person["email"] = em;
      }
    }

    if (entry['gd$phoneNumber']) {
      var phones = entry['gd$phoneNumber'];
      for (var j = 0, phone; phone = phones[j]; j++) {
        var ph = phone['$t'];
        contact['phones'].push(ph);
        person["phone"] = ph;
      }
    }

    if (!contact['name']) {
      contact['name'] = contact['emails'][0] || "<Unknown>";
      person["name"] = person["email"] || "<Unknown>";
    }
    contacts.push(contact);
    people.push(person);
  }
  //chrome.tabs.create({ 'url' : 'contacts.html'});
};

function getContacts() {
  oauth.authorize(function() {
    console.log("on authorize");
    setIcon();
    var url = "http://www.google.com/m8/feeds/contacts/default/full";
    oauth.sendSignedRequest(url, onContacts, {
      'parameters' : {
        'alt' : 'json',
        'max-results' : 100
      }
    });
  });
};

function logout() {
  oauth.clearTokens();
  setIcon();
};

//setIcon();
//chrome.browserAction.onClicked.addListener(getContacts);
