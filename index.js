var request = require("request")
var stringify = require('csv-stringify');
var fs = require('fs');
var prompt= require('prompt');

var url = "https://www.googleapis.com/books/v1/volumes?q=";

prompt.start();
var searchTerm;

prompt.get(['SearchTerm'], function (err, result) {
  if (err) {
      return onErr(err);
  }
  console.log('Command-line input received:');
  console.log(' Search Term: ' + result.SearchTerm);
  searchTerm = result.SearchTerm;
  url = url+searchTerm;
  console.log(url);

  request({
     url: url,
     json: true
  },
  function (error, response, body) {
      if(!error && response.statusCode === 200){
          console.log(body.items[0].volumeInfo.title)

          var matchingBooks = [[ 'title', 'subtitle', 'authors','description','price', 'avgRating', 'ratingsCount', 'publishedDate', 'pageCount' ]];
          for(var i=0; i<body.items.length; i++){
              var title = body.items[i].volumeInfo.title;
              var subtitle = body.items[i].volumeInfo.subtitle;
              var authors = body.items[i].volumeInfo.authors;
              var description = body.items[i].volumeInfo.description;
              var price = body.items[i].saleInfo.listPrice;
              var avgRating = body.items[i].volumeInfo.averageRating;
              var ratingsCount = body.items[i].volumeInfo.ratingsCount;
              var publishedDate = body.items[i].volumeInfo.publishedDate;
              var pageCount = body.items[i].volumeInfo.pageCount;
              matchingBooks.push([title, subtitle, authors, description, price, avgRating, ratingsCount, publishedDate, pageCount]);

          }
          stringify(matchingBooks, function(err, output){
              console.log(output);
              fs.writeFile('userLib.csv', output, (err) => {
                  if (err) throw err;
                  console.log('The file has been saved!');
              });
          })

          function onErr(err) {
            console.log(err);
            return 1;
          }

      }
  })
});
