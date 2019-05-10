const request = require('request');
const cheerio = require('cheerio');
const URL = require ('url-parse');
const fs = require('fs');
const util = require('util');
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');

var pageToVisit = "http://epicabot.blogspot.com/2018/11/abyssal-spirals.html";
console.log("Visiting page " + pageToVisit);
request(pageToVisit, async function(error, response, body){
    if (error) {
        console.log("Error: " + error);
    }

    console.log("Status code: " + response.statusCode);
    if (response.statusCode === 200) {
        var loadedCheerio = cheerio.load(body);
	console.log("==============================================\n\n");
        console.log("Page title: " + loadedCheerio('title').text() + "\n\n");
	//console.log("Testing: " + await readTextFile());
	//console.log("Testing 2.0: " + await getAllLinks(loadedCheerio));
        console.log("\nResult: " + await filterLinks(await getAllLinks(loadedCheerio)));
	console.log("\n\n\n\n==============================================");
    }

});
async function readTextFile() {
    var returnData = [];
    data = await readFile('websites.txt');
    returnData.push(data.replace( /\r\n/g, "#" ).split("#").join(""));
    //returnData.push(data.replace( /\r\n/g, "|" ));
    console.log("returnData: " + returnData);
    console.log("returnData.length: " + returnData.length);
    return returnData;
}


async function getAllLinks(loadedCheerio) {

    var allAbsoluteLinks = [];

    var absoluteLinks = loadedCheerio("a[href^='http']");
    absoluteLinks.each(function() {
        allAbsoluteLinks.push(loadedCheerio(this).attr('href'));
    });
    return allAbsoluteLinks;
}

async function filterLinks(allPageLinks) {
    var returnLink = [];
    var allCorrectLinks = await readTextFile();

    console.log("All Correct Links: " + allCorrectLinks);
    console.log("All Correct Links Length: " + allCorrectLinks.length);
    console.log("\nAll Page Links: " + allPageLinks);

    for (var i = 0; i < allPageLinks.length; i++) {
        for (var j = 0; j < allCorrectLinks.length; j++) {
	    var pageLink = allPageLinks[i];
            var correctLink = allCorrectLinks[j];
	    
	    console.log("PageLink: |" + pageLink.substring(0, correctLink.length - 1) + "|     CorrectLink: |" + correctLink + "|");
            if (pageLink.startsWith(correctLink)) {	
		console.log("aosdijasdkasfkpoaslfl");
                returnLink.push(pageLink);
            }
        }
    }
    return Array.from(new Set(returnLink));
}
