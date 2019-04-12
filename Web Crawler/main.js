var request = require('request');
var cheerio = require('cheerio');
var URL = require ('url-parse');


var pageToVisit = "http://epicabot.blogspot.com/2018/11/abyssal-spirals.html";
console.log("Visiting page " + pageToVisit);
request(pageToVisit, function(error, response, body){
    if (error) {
        console.log("Error: " + error);
    }

    console.log("Status code: " + response.statusCode);
    if (response.statusCode === 200) {
        var loadedCheerio = cheerio.load(body);
        console.log("Page title: " + loadedCheerio('title').text());
    }
    console.log("Looking for 'Green': " + searchForAWord(loadedCheerio, "jioasklm"));

});

function searchForAWord ($, word) {
    var bodyText = $('html > body').text();
    if (bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
        return true;
    }
    return false;
}