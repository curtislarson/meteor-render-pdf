Router.route("/database/:pdfId", function() {
  var pdfId = this.params.pdfId;

  // Read from a CollectionFs FS.File
  // Assumes you have a "Pdfs" CollectionFs
  var file = Pdfs.findOne({_id: pdfId});
  var readable = file.createReadStream("tmp");
  var buffer = new Buffer(0);
  readable.on("data", function(buffer) {
    buffer = buffer.concat([buffer, readable.read()]);
  });
  readable.on("end", function() {
    this.response.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Length": buffer.length
    });
    this.response.write(buffer);
    this.response.end();
  });
}, {
  where: "server"
});

Router.route("/file/:fileName", function() {
  var fileName = this.params.fileName;

  // Read from a file (requires 'meteor add meteorhacks:npm')
  var filePath = "/path/to/pdf/store/" + fileName;
  var fs = Meteor.npmRequire('fs');
  var data = fs.readFileSync(filePath);

  this.response.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Length": data.length
  });
  this.response.write(data);
  this.response.end();
}, {
  where: "server"
});