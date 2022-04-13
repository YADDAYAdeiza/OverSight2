//requiring all the dependencies
var express = require("express");
//var path = require('path');
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");
var mysql = require("mysql");
const fileUpload = require("express-fileupload");
const formidable = require("express-formidable");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "OverSightNode",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});

con.connect(function (err) {
  if (err) throw err;
});

var app = express();

app.get("/compData", function (req, res2, next) {
  //con.connect(function(err){
  var genArr = [];
  if (err) throw err;
  //var sql = "CREATE DATABASE OverSightNode";
  var sql = "SELECT * FROM Generic";
  con.query(sql, function (err, res) {
    if (err) throw err;
    console.log("Generic options selected!");
    console.log(res);
    for (var a = 0; a < res.length; a++) {
      genArr.push(res[a].GenName);
    }
    res2.send(JSON.stringify(genArr));
  });
  console.log("Options selecting...");
  //});
});

app.get("/getBack", function (req, res2) {
  console.log("Entering....");
  console.log(req.query);
  //con.connect(function(err){
  var getBackArr = [];
  //if (err) throw err;
  //var sql = "CREATE DATABASE OverSightNode";
  var sql = "SELECT * FROM " + req.query.nameOfSel;
  switch (req.query.nameOfSel) {
    case "Company":
      con.query(sql, function (err, res) {
        if (err) throw err;
        console.log("Generic options selected!");
        console.log(res);
        for (var a = 0; a < res.length; a++) {
          getBackArr.push(res[a].CompanyName);
        }
        res2.send(JSON.stringify(getBackArr));
      });
      break;
    case "DosageForms":
      con.query(sql, function (err, res) {
        if (err) throw err;
        console.log("Generic options selected!");
        console.log(res);
        for (var a = 0; a < res.length; a++) {
          getBackArr.push(res[a].DosFormsType);
        }
        res2.send(JSON.stringify(getBackArr));
      });
      break;
    case "InspectionType":
      con.query(sql, function (err, res) {
        if (err) throw err;
        console.log("Generic options selected!");
        console.log(res);
        for (var a = 0; a < res.length; a++) {
          getBackArr.push(res[a].InspTypeName);
        }
        res2.send(JSON.stringify(getBackArr));
      });
      break;
    case "State":
      var sql = "SELECT DISTINCT * FROM CompanyAddress3";
      con.query(sql, function (err, res) {
        if (err) throw err;
        console.log("State options selected!");
        console.log(res);
        for (var a = 0; a < res.length; a++) {
          getBackArr.push(res[a].State);
        }
        res2.send(JSON.stringify(getBackArr));
      });
      break;
    case "Inspectors":
      con.query(sql, function (err, res) {
        if (err) throw err;
        console.log("Inspectors options selected!");
        console.log(res);
        for (var a = 0; a < res.length; a++) {
          getBackArr.push(res[a].InspLastName + " " + res[a].InspFirstName);
        }
        res2.send(JSON.stringify(getBackArr));
      });
      break;
    case "Generic":
      con.query(sql, function (err, res) {
        console.log("Generics");

        if (err) throw err;
        console.log("Generic options selected!");
        console.log(res);
        for (var a = 0; a < res.length; a++) {
          getBackArr.push(res[a].GenName);
        }
        res2.json(getBackArr);
      });
      break;
    case "SubClass":
      con.query(sql, function (err, res) {
        if (err) throw err;
        console.log("SubClass options selected!");
        console.log(res);
        for (var a = 0; a < res.length; a++) {
          getBackArr.push(res[a].SubClassName);
        }
        res2.json(getBackArr);
      });
      break;
    case "DateFrom":
      res2.send("");
      break;
    case "DateTo":
      res2.send("");
      break;
    default:
      console.log("Unhandled");
  }

  console.log("Options selecting...");
  //});
});

app.use(
  "/ProfilePicsFoldera",
  express.static(__dirname + "/ProfilePicsFolder")
);
//const http = require("http");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

//app.get("/", express.static(path.join(__dirname, "./public")));
//app.use('/publica', express.static(__dirname + "/public"));

app.get("/getImage", function (req, res, next) {
  //res.render ('overSightHtml');
  console.log("Getting imageicon...");
  res.send(
    express.static(__dirname + "/ProfilePicsFolder/icons8-delete-24.png")
  );
});

const handleError = function (err, res) {
  res.status(500);
  res.contentType("text/plain");
  res.end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "ProfilePics/Here/",
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.post("/upload", upload.single("fileProfile"), function (req, res) {
  //res.render(path.join(__dirname, "OverSightOpt9-Node"));
  //res.sendFile(path.join(__dirname, "OverSightOpt9-Node"));
  const tempPath = req.file.path;
  console.log("This is path ah eh", tempPath);
  console.log("Dala");
  const targetPath = path.join(__dirname, "./ProfilePicsFolder/image.png");
  console.log(targetPath);
  console.log(req.file);
  console.log("About to enter test");
  if (path.extname(req.file.originalname).toLowerCase() !== ".png") {
    console.log("png, yes");
    fs.rename(tempPath, targetPath, (err) => {
      if (err) return handleError(err, res);

      res.redirect("/success");
      //.sendFile(path.join(__dirname, "OverSightOpt9-Node"));
    });
  } else {
    fs.unlink(tempPath, function (err) {
      if (err) return handleError(err, res);
      res.status(403);
      res.contentType("text/plain");
      res.end("Only .png files are allowed!");
    });
  }
  console.log("Rendered...");
});

app.get("/success", function (req, res) {
  console.log("I am getting there");
  //res.send('Da thing!');
  //res.send(path.join("/ProfilePicsFoldera/image.png"));
  res.render(path.join(__dirname, "/Views/OverSightOpt9-Node"));
  //res.sendFile(path.join(__dirname, "OverSightOpt9-Node"));
});

app.get("/image.png", function (req, res) {
  console.log("Getting the image...");
  //res.send('Da thing!');
  res.send(path.join("/ProfilePicsFoldera/image.png"));
  //res.render(path.join(__dirname, "/Views/OverSightOpt9-Node"));
  //res.sendFile(path.join(__dirname, "OverSightOpt9-Node"));
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "OverSightNode",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});

//requiring all the files
var index = require("./routes/index");
var users = require("./routes/users");
var overSight = require("./routes/overSight");
//var staffOverSightNode = require ('./routes/StaffOverSightNodeHandle');

// view engine setup
app.engine("hbs", hbs({ extname: "hbs", layoutsDir: __dirname + "/views/" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(formidable());
//app.use(fileUpload());
//app.use(express.static(path.join(__dirname, 'public')));

app.use("/", overSight);
app.use("/users", users);
//app.use ('/StaffOverSightNode',staffOverSightNode);

app.get("/SearchAjaxRandRInterfaceNoC3", function (req, res2, next) {
  console.log(
    "This is name of company",
    req.query.histComp,
    " and this is address",
    req.query.histAdd
  );
  console.log("Querying for:", req.query.selReport);
  //console.log('Hitting this.');
  /*
	var queryStr = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName,"+
			" Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType,"+
			" InspectionID, InspDate, InspTypeName, Findings4.FindingImg, Findings4.FindingDets, Findings4.FindCat, Findings4.FindObservation, Findings4.FindingID"+
			" FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON"+
			" Company.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON"+
			" Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN Findings4 ON Inspection.InspectionID = Findings4.InspID INNER JOIN Product4 ON"+
			" Findings4.ProductID = Product4.ProductID INNER JOIN SubClass ON Product4.ProductSubClass = SubClass.SubClassID INNER JOIN Generic ON"+
			" Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormId WHERE DATEDIFF(CURDATE(), InspDate) < 130"+
			" ORDER BY CompanyName, ProductLineName, InspDate, InspTypeName, ProductName";
		*/
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, InspectionID, InspDate, Findings4.FindingDets FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN Findings4 ON Inspection.InspectionID = Findings4.InspID";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID INNER JOIN Inspection ON Findings4.InspID = Inspection.InspectionID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID INNER JOIN Inspection ON Product4.PID = Inspection.InspectionID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN Product4 ON Company.CompanyID = Product4.CompID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN ProductLine ON Product4.ProductLineID = ProductLine.ProductLineID INNER JOIN Findings4 ON ProductLine.ProductLineID = Findings4.ProductLineID INNER JOIN Inspection ON Findings4.InspID = Inspection.InspectionID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID LEFT JOIN Inspection ON Product4.InspID = Inspection.InspectionID";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN Inspection ON Company.CompanyID = Inspection.CompanyID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID ORDER BY CompanyName, InspDate, InspTypeName";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, InspDate, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN Inspection ON Company.CompanyID = Inspection.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID ORDER BY CompanyName, ProductLineName, InspDate, ProductName";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN Product4 ON Company.CompanyID = Product4.CompID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID INNER JOIN ProductLine ON Product4.ProductLineID = ProductLine.ProductLineID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID ORDER BY CompanyName, ProductLineName, InspDate, ProductName";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN Product4 ON Company.CompanyID = Product4.CompID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN ProductLine on Product4.ProductLineID = ProductLine.ProductLineID LEFT JOIN Findings4 ON ProductLine.ProductLineID = Findings4.ProductLineID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID ORDER BY CompanyName, ProductLineName, InspDate, ProductName";
  //var queryStr ="SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN Product4 ON Company.CompanyID = Product4.CompID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN ProductLine ON Product4.ProductLineID = ProductLine.ProductLineID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID LEFT JOIN Findings4 ON Inspection.InspectionID = Findings4.InspID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID ORDER BY CompanyName, ProductLineName, InspDate, InspTypeName, ProductName";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN Product4 ON Company.CompanyID = Product4.CompID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 on Product4.ProductID = Findings4.ProductID INNER JOIN ProductLine ON ProductLine.ProductLineID = Findings4.ProductLineID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID ORDER BY CompanyName, ProductLineName, InspDate, InspTypeName, ProductName";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN Product4 ON Inspection.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID ORDER BY CompanyName, ProductLineName, InspDate, InspTypeName, ProductName";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN InspectionProducts on Inspection.InspectionID = InspectionProducts.InspectionID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID ORDER BY CompanyName, ProductLineName, InspDate, InspTypeName, ProductName";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspectionProducts.InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID INNER JOIN InspectionProducts ON Product4.ProductID = InspectionProducts.ProductID INNER JOIN Inspection ON InspectionProducts.InspectionID = Inspection.InspectionID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN InspectionProducts ON Product4.ProductID = InspectionProducts.ProductID LEFT JOIN Findings4 ON InspectionProducts.ProductID = Findings4.ProductID AND InspectionProducts.InspectionID = Findings4.InspID WHERE InspDate > '2019-04-08 10:52:01'";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN InspectionProducts ON Product4.ProductID = InspectionProducts.ProductID LEFT JOIN Findings4 ON InspectionProducts.ProductID = Findings4.ProductID AND InspectionProducts.InspectionID = Findings4.InspID WHERE InspDate > '2019-04-08 10:52:01' ORDER BY CompanyName, CompanyAdd, InspDate DESC, ProductLineName ASC";

  if (req.query.selReport) {
    console.log("first option");
    console.log("This is selReport", req.query.selReport);
    var queryStr =
      "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN InspectionProducts ON Product4.ProductID = InspectionProducts.ProductID LEFT JOIN Findings4 ON InspectionProducts.ProductID = Findings4.ProductID AND InspectionProducts.InspectionID = Findings4.InspID WHERE InspDate > DATE_SUB(CURDATE(),INTERVAL " +
      req.query.selReport +
      " DAY) ORDER BY CompanyName, CompanyAdd, InspDate DESC, ProductLineName ASC";
  } else {
    console.log("second option");
    console.log("This is selReport", req.query.selReport);
    var queryStr =
      "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN InspectionProducts ON Product4.ProductID = InspectionProducts.ProductID LEFT JOIN Findings4 ON InspectionProducts.ProductID = Findings4.ProductID AND InspectionProducts.InspectionID = Findings4.InspID WHERE CompanyName = '" +
      req.query.histComp +
      "' AND CompanyAdd = '" +
      req.query.histAdd +
      "' ORDER BY CompanyName, CompanyAdd, InspDate DESC, ProductLineName ASC";
  }

  //var sql = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE CompanyName LIKE ?";
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN InspectionProducts ON Product4.ProductID = InspectionProducts.ProductID LEFT JOIN Findings4 ON InspectionProducts.ProductID = Findings4.ProductID AND InspectionProducts.InspectionID = Findings4.InspID";
  con.query(queryStr, function (err, res) {
    if (err) throw err;
    console.log("This is result: ");
    console.log(res);
    console.log(res[0].ProductLineName);
    console.log(res.length);
    var objArr = [];
    var obj = {};

    for (var a = 0; a < res.length; a++) {
      //console.log(obj[res[a].CompanyName]);
      //console.log(obj[res[a].ProductLineName]);
      //console.log(obj[res[a].ProductName);
      if (!obj[res[a].CompanyName]) obj[res[a].CompanyName] = {};
      if (!obj[res[a].CompanyName][res[a].CompanyAdd])
        obj[res[a].CompanyName][res[a].CompanyAdd] = {};

      obj[res[a].CompanyName][res[a].CompanyAdd]["CompAdd"] = res[a].CompanyAdd;
      obj[res[a].CompanyName][res[a].CompanyAdd]["Lat"] = res[a].Latitude;
      obj[res[a].CompanyName][res[a].CompanyAdd]["Lng"] = res[a].Longitude;
      obj[res[a].CompanyName][res[a].CompanyAdd]["State"] = res[a].State;
      obj[res[a].CompanyName][res[a].CompanyAdd]["ContPers"] =
        res[a].ContactPerson;
      obj[res[a].CompanyName][res[a].CompanyAdd]["CompEmail"] =
        res[a].CompanyEmail;
      //console.log('Product line Name: '+res[a].ProductLineName);
      if (!obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate])
        obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate] = {};
      if (
        !obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ]
      )
        obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ] = {};
      if (
        !obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ][res[a].InspTypeName]
      )
        obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ][res[a].InspTypeName] = {};
      if (
        !obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ][res[a].InspTypeName][res[a].ProductName]
      )
        obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ][res[a].InspTypeName][res[a].ProductName] = {};
      obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
        res[a].ProductLineName
      ][res[a].InspTypeName][res[a].ProductName]["ProdStr"] =
        res[a].ProductStrength;
      obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
        res[a].ProductLineName
      ][res[a].InspTypeName][res[a].ProductName]["SubClassName"] =
        res[a].SubClassName;
      obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
        res[a].ProductLineName
      ][res[a].InspTypeName][res[a].ProductName]["Gen"] = res[a].GenName;
      obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
        res[a].ProductLineName
      ][res[a].InspTypeName][res[a].ProductName]["DosFormsType"] =
        res[a].DosFormsType;
      obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
        res[a].ProductLineName
      ][res[a].InspTypeName][res[a].ProductName]["NRN"] = res[a].NRN;
      obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
        res[a].ProductLineName
      ][res[a].InspTypeName][res[a].ProductName]["PID"] = res[a].ProductID;
      if (
        !obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ][res[a].InspTypeName][res[a].ProductName][res[a].FindingImg]
      )
        obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ][res[a].InspTypeName][res[a].ProductName][res[a].FindingImg] = [];
      if (
        !obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ][res[a].InspTypeName][res[a].ProductName]["Findings"]
      )
        obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
          res[a].ProductLineName
        ][res[a].InspTypeName][res[a].ProductName]["Findings"] = []; //creating new Finding
      //obj[res[a].CompanyName][res[a].ProductLineName][res[a].InspDate][res[a].InspTypeName][res[a].ProductName][res[a].FindingDets] = []; //blanking Finding (new and old) array
      obj[res[a].CompanyName][res[a].CompanyAdd][res[a].InspDate][
        res[a].ProductLineName
      ][res[a].InspTypeName][res[a].ProductName]["Findings"].push(
        res[a].FindingImg,
        res[a].FindingDets,
        res[a].FindCat,
        res[a].FindObservation,
        res[a].FindingID
      );
      //obj[res[a].CompanyName][res[a].ProductLineName][res[a].InspDate][res[a].InspTypeName][res[a].ProductName][res[a].FindingDets].push(res[a].FindingDets);
      //obj[res[a].CompanyName][res[a].ProductLineName][res[a].InspDate][res[a].InspTypeName][res[a].ProductName][res[a].FindCat].push(res[a].FindCat);
      //obj[res[a].CompanyName][res[a].ProductLineName][res[a].InspDate][res[a].InspTypeName][res[a].ProductName][res[a].FindObservation].push(res[a].FindObservation);
      //obj[res[a].CompanyName][res[a].ProductLineName][res[a].InspDate][res[a].InspTypeName][res[a].ProductName][res[a].FindingID].push(res[a].FindingID);
      //obj[res[a].CompanyName][res[a].ProductLineName].push(res[a].ProductName);
    }

    console.log("Aggregated object: ");
    console.log(obj);
    //res2.send(JSON.stringify(obj));

    var grandObj = [];
    for (var p in obj) {
      console.log("Processing...");
      if (typeof obj[p] == "object" && !Array.isArray(obj[p])) {
        //drill down; if =='string', skip
        if (obj.hasOwnProperty(p)) {
          console.log("Name of Company: " + p);
          for (var pq in obj[p]) {
            if (typeof obj[p][pq] == "object" && !Array.isArray(obj[p][pq])) {
              if (obj[p].hasOwnProperty(pq)) {
                console.log("And address: " + pq);
                for (var q in obj[p][pq]) {
                  if (
                    typeof obj[p][pq][q] == "object" &&
                    !Array.isArray(obj[p][pq][q])
                  ) {
                    if (obj[p][pq].hasOwnProperty(q)) {
                      console.log("Date of Inspection: " + q);
                      for (var r in obj[p][pq][q]) {
                        if (
                          typeof obj[p][pq][q][r] == "object" &&
                          !Array.isArray(obj[p][pq][q][r])
                        ) {
                          if (obj[p][pq][q].hasOwnProperty(r)) {
                            console.log("Product Line: " + r);
                            for (var s in obj[p][pq][q][r]) {
                              if (
                                typeof obj[p][pq][q][r][s] == "object" &&
                                !Array.isArray(obj[p][pq][q][r][s])
                              ) {
                                if (obj[p][pq][q][r].hasOwnProperty(s)) {
                                  console.log("Type of Inspection: " + s);

                                  var objUnit = {};
                                  objUnit[p] = {};
                                  objUnit[p][pq] = {}; //address
                                  objUnit[p][pq]["CompAdd"] =
                                    obj[p][pq]["CompAdd"];
                                  objUnit[p][pq]["Lat"] = obj[p][pq]["Lat"];
                                  objUnit[p][pq]["Lng"] = obj[p][pq]["Lng"];
                                  objUnit[p][pq]["State"] = obj[p][pq]["State"];
                                  objUnit[p][pq]["ContPers"] =
                                    obj[p][pq]["ContPers"];
                                  objUnit[p][pq]["CompEmail"] =
                                    obj[p][pq]["CompEmail"];

                                  objUnit[p][pq][q] = {};
                                  objUnit[p][pq][q][r] = {};
                                  objUnit[p][pq][q][r][s] = {};
                                  for (var t in obj[p][pq][q][r][s]) {
                                    if (
                                      typeof obj[p][pq][q][r][s][t] ==
                                        "object" &&
                                      !Array.isArray(obj[p][pq][q][r][s][t])
                                    ) {
                                      if (
                                        obj[p][pq][q][r][s].hasOwnProperty(t)
                                      ) {
                                        console.log("Product Name: " + t);

                                        var findingsArr = [];

                                        objUnit[p][pq][q][r][s][t] = {};
                                        objUnit[p][pq][q][r][s][t]["ProdStr"] =
                                          obj[p][pq][q][r][s][t]["ProdStr"];
                                        objUnit[p][pq][q][r][s][t][
                                          "SubClassName"
                                        ] =
                                          obj[p][pq][q][r][s][t][
                                            "SubClassName"
                                          ];
                                        objUnit[p][pq][q][r][s][t]["Gen"] =
                                          obj[p][pq][q][r][s][t]["Gen"];
                                        objUnit[p][pq][q][r][s][t][
                                          "DosFormsType"
                                        ] =
                                          obj[p][pq][q][r][s][t][
                                            "DosFormsType"
                                          ];
                                        objUnit[p][pq][q][r][s][t]["NRN"] =
                                          obj[p][pq][q][r][s][t]["NRN"];
                                        objUnit[p][pq][q][r][s][t]["PID"] =
                                          obj[p][pq][q][r][s][t]["PID"];
                                        objUnit[p][pq][q][r][s][t][
                                          "Finds"
                                        ] = [];
                                        for (
                                          var u = 0;
                                          u <
                                          obj[p][pq][q][r][s][t]["Findings"]
                                            .length;
                                          u++
                                        ) {
                                          //if (obj[p][q][r][s][t][u] != null) { //guiding against products with no findings
                                          findingsArr.push(
                                            obj[p][pq][q][r][s][t]["Findings"][
                                              u
                                            ]
                                          );
                                          //}
                                        }
                                        objUnit[p][pq][q][r][s][t][
                                          "Finds"
                                        ] = findingsArr;
                                        //Now, for convenince

                                        //objUnit[p][pq][q][r][s][t]['P']
                                      }
                                    }
                                  }
                                }
                              }

                              //objUnit[p][pq][q][r][s];
                              objUnit[p][pq][q][r][s]["NoC"] = p;
                              objUnit[p][pq][q][r][s]["CompAddr"] = pq;
                              objUnit[p][pq][q][r][s]["Date"] = q;
                              objUnit[p][pq][q][r][s]["PL"] = r;
                              objUnit[p][pq][q][r][s]["InspType"] = s;
                              console.log(objUnit[p][pq][q][r][s]);
                              console.log("Exporting...");
                              console.log(objUnit);
                              grandObj.push(objUnit);
                            }
                          }
                        }
                      }
                    }
                  } //testing for object
                }
              }
            } //Address 'if' loop
          } //Address 'for' loop
        }
      } //testing for object
    }
    res2.send(JSON.stringify(grandObj));
  });
});

app.post("/insight", function (req, res2) {
  var insightStr = "";
  var insightStr2 = "";
  var counter = 0;
  console.log("Insight on the way...");
  console.log(req.body);
  var modBody = (req.body.field = {});
  console.log(req.body);
  for (inSightName in req.body) {
    console.log("Looping...");
    switch (inSightName) {
      case "Company":
        console.log("Entered company...");
        req.body.field["Company"] = "CompanyName";
        break;
      case "DosageForms":
        console.log("Entered dosage forms...");
        req.body.field["DosageForms"] = "DosFormsType";
        break;
      case "State":
        console.log("State parameter present...");
        req.body.field["State"] = "State";
        break;
      case "InspectionType":
        console.log("Entered Inspection Type...");
        req.body.field["InspectionType"] = "InspTypeName";
        break;
      case "Inspectors":
        console.log("Entered Inspectors...");
        //req.body.field['Inspectors'] = 'InspectorName';
        console.log(req.body[inSightName]);
        var inspectorNameArr = req.body[inSightName].split(" ");
        console.log(inspectorNameArr);
        req.body.field["Inspectors"] = {};
        req.body.field["Inspectors"]["LastName"] = inspectorNameArr[0];
        req.body.field["Inspectors"]["FirstName"] = inspectorNameArr[1];
        console.log(req.body.field);
        break;
      case "Generic":
        console.log("Entered Generic...");
        req.body.field["Generic"] = "GenName";
        break;
      case "SubClass":
        console.log("Entered SubClass...");
        req.body.field["SubClass"] = "SubClassName";
        break;
      case "DateFrom":
        console.log("DateFrom parameter present...");
        req.body.field["DateFrom"] = "InspDate";
        break;
      case "DateTo":
        console.log("DateTo parameter present...");
        req.body.field["DateTo"] = "InspDate";
        break;
      case "Compliance":
        console.log("Compliance parameter present...");
        req.body.field["Compliance"] = "FindObservation";
        break;
      case "NRN":
        console.log("NRN parameter present...");
        req.body.field["NRN"] = "NRN";
        break;
      default:
        console.log("Nothing to handle");
    }
  }

  console.log("---");
  console.log(req.body);
  console.log(req.body["Company"]);
  console.log(req.body.DosageForms);

  var inspNameStr = "";
  var dateStr = "";

  if (req.body.field["Inspectors"]) {
    inspNameStr =
      " AND InspLastName = '" +
      req.body.field["Inspectors"]["LastName"] +
      "' AND InspFirstName = '" +
      req.body.field["Inspectors"]["FirstName"] +
      "'";
    delete req.body.field["Inspectors"];
  }

  console.log("This is inspector name: " + inspNameStr);

  if (req.body.field["DateTo"] && req.body.field["DateFrom"]) {
    //if both date parameters are present
    console.log("Old Length:", Object.keys(req.body.field).length);
    console.log("True");
    inspNameStr =
      " AND InspDate BETWEEN '" +
      req.body["DateFrom"] +
      "' AND '" +
      req.body["DateTo"] +
      "'" +
      inspNameStr;
    console.log(dateStr);
    delete req.body.field["DateFrom"];
    delete req.body.field["DateTo"];
    console.log("New length:", Object.keys(req.body.field).length);
    insightStr = inspNameStr;
  } else if (req.body.field["DateTo"]) {
    //if both date parameters are present
    console.log("Old Length:", Object.keys(req.body.field).length);
    console.log("True");
    inspNameStr =
      " AND InspDate BETWEEN '2018-05-08' AND '" +
      req.body["DateTo"] +
      "'" +
      inspNameStr;
    console.log(dateStr);
    delete req.body.field["DateFrom"];
    delete req.body.field["DateTo"];
    console.log("New length:", Object.keys(req.body.field).length);
    insightStr = inspNameStr;
  } else if (req.body.field["DateFrom"]) {
    console.log("Old Length:", Object.keys(req.body.field).length);
    console.log("True");
    inspNameStr =
      " AND InspDate >= '" + req.body["DateFrom"] + "'" + inspNameStr;
    console.log(dateStr);
    delete req.body.field["DateFrom"];
    delete req.body.field["DateTo"];
    console.log("New length:", Object.keys(req.body.field).length);
    insightStr = inspNameStr;
  }

  if (Object.keys(req.body.field).length == 0) {
    //taking off the ' AND ' since query consists of only  inspectors and perhaps dates
    inspNameStr = inspNameStr.substr(5);
    insightStr = inspNameStr;
  }

  console.log(insightStr);
  console.log("---");
  console.log("...entering insight now");
  for (inSightName in req.body.field) {
    console.log("Inside insight");
    counter++;
    console.log(counter);

    console.log(req.body.field[inSightName]);
    console.log(req.body[req.body.field[inSightName]]);
    console.log(inSightName);
    if (inSightName == "DateFrom" || inSightName == "DateTo") {
      console.log("Do nothing. Handled already");
    } else {
      if (counter == Object.keys(req.body.field).length) {
        insightStr2 +=
          req.body.field[inSightName] +
          "= '" +
          req.body[inSightName] +
          "'" +
          dateStr;
        console.log(insightStr2);
        console.log("Ends here for 1.");
      } else {
        insightStr2 +=
          req.body.field[inSightName] +
          "= '" +
          req.body[inSightName] +
          "'" +
          " AND ";
        console.log("Ends here.");
      }
    }
  }
  console.log("---");
  console.log(insightStr);

  insightStr2 += insightStr;
  console.log(insightStr2);
  //var queryStr= "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName, Inspector FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN InspectionProducts ON Product4.ProductID = InspectionProducts.ProductID LEFT JOIN Findings4 ON InspectionProducts.ProductID = Findings4.ProductID AND InspectionProducts.InspectionID = Findings4.InspID WHERE "+insightStr+" ORDER BY CompanyName, CompanyAdd, InspDate DESC, ProductLineName ASC";
  var queryStr =
    "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspDate, InspTypeName, CONCAT (InspLastName, ' ', InspFirstName) AS InspectorName, InspFirstName, InspLastName, Inspector FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN InspectionProducts ON Product4.ProductID = InspectionProducts.ProductID INNER JOIN Inspectors ON InspectionProducts.Inspector =Inspectors.InspectorID LEFT JOIN Findings4 ON InspectionProducts.ProductID = Findings4.ProductID AND InspectionProducts.InspectionID = Findings4.InspID WHERE " +
    insightStr2 +
    " ORDER BY CompanyName, CompanyAdd, InspDate DESC, ProductLineName ASC";

  con.query(queryStr, function (err, res) {
    if (err) throw err;
    //console.log(res);
    res2.send(JSON.stringify(res));
  });
});

app.post("/insight2", function (req, res2) {
  console.log("Right in here...");
  console.log(req.body);
  console.log(JSON.stringify(req.body));
  console.log("Length is: ", req.body.length);
  console.log("This is oID", req.body.oId);
  var obj;
  if (req.body.oId) {
    console.log(req.body.oId);
    console.log("Unsaving...");
    var dashStr = "DELETE FROM Dashboard WHERE DashboardID =?";
    con.query(dashStr, [req.body.oId], function (err, res) {
      if (err) throw err;

      console.log("Deleted!");
      res2.send(JSON.stringify("Deleted"));
    });
  } else if (req.body.updateId) {
    console.log("Updating(f)....");
    console.log(req.body);
    var updateId = req.body.updateId;
    var dashStr = {
      checkDisagg: req.body.checkDisagga,
      dashStat: req.body.divStr,
      graType: req.body.graType,
      filtType: req.body.filtType,
    };
    var dashStr1 = JSON.stringify(dashStr);
    console.log(dashStr1);
    console.log("This is dashboardId: ", updateId);
    console.log(req.body);

    delete req.body.checkDisagga;
    delete req.body.updateId;
    delete req.body.divStr;
    delete req.body.graType;
    delete req.body.filtType;

    var reqBody = JSON.stringify(req.body);
    console.log(req.body);
    console.log(req.body.oId);
    console.log("Updating...");
    if (delete req.body.divStr == false) {
      var insertStr =
        "UPDATE Dashboard SET ModDate = NOW(), SavData = ?, DashStatus = ?  WHERE DashboardID =?";
    } else {
      var insertStr =
        "UPDATE Dashboard SET ModDate = NOW(), SavData = ?, DashStatus = ? WHERE DashboardID =?";
    }
    con.query(insertStr, [reqBody, dashStr1, updateId], function (err, res) {
      if (err) throw err;

      console.log("updated...");
      res2.send(JSON.stringify("Updated"));
    });
  } else if (req.body.updateId == undefined) {
    console.log("Saving...");
    console.log(req.body);
    console.log("This is updateId: " + req.body.updateId);
    var dashStr = {
      checkDisagg: req.body.checkDisagga,
      dashStat: req.body.divStr,
      graType: req.body.graType,
      filtType: req.body.filtType,
    };
    var dashStr2 = JSON.stringify(dashStr);

    delete req.body.checkDisagga;
    delete req.body.divStr;
    delete req.body.graType;
    delete req.body.filtType;
    obj = JSON.stringify(req.body);
    console.log(obj);
    var queryStr =
      "SELECT UserID From Credentials WHERE UserName = ? AND Password = ?";

    con.query(queryStr, ["Adeiza", "Ad"], function (err, res) {
      if (err) throw err;
      console.log(res);
      console.log(res.length);
      console.log(Array.isArray(res));
      console.log(res[0].UserID);
      var credUserID = res[0].UserID;

      //(function (credUserID) {
      var dashStr =
        "INSERT INTO Dashboard (UserID, SavDate, SavData, DashStatus) VALUES (?, NOW(), ?,?)";
      con.query(dashStr, [credUserID, obj, dashStr2], function (err, res) {
        if (err) throw err;
        console.log(res.insertId);
        console.log(res.length);
        console.log(Array.isArray(res));
        console.log("Inserted...");
        res2.send(JSON.stringify(res.insertId));
      });
      //})(credUserID);
    });
  }
});

app.post("/profileInspector", function (req, res, next) {
  console.log("Hitting...");
  console.log(req.body.InspectorName);
  var sql =
    "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE CompanyName LIKE ?";
});

app.post("/GetDashboards", function (req, res2) {
  console.log("Getting dashboards...");
  //res.json({"Dash": "Something"});
  //var sql = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE CompanyName LIKE ?";
  var queryStr =
    "SELECT UserID From Credentials WHERE UserName = ? AND Password = ?";

  con.query(queryStr, ["Adeiza", "Ad"], function (err, res) {
    if (err) throw err;
    console.log(res);
    console.log(res.length);
    console.log(Array.isArray(res));
    console.log(res[0].UserID);
    var credUserID = res[0].UserID;

    //(function (credUserID) {
    var dashStr =
      "SELECT DashboardID, ModDate, SavData, DashStatus From Dashboard WHERE UserID = ?;";
    //var dashStr= "INSERT INTO Dashboard (UserID, SavDate, SavData, DashStatus) VALUES (?, NOW(), ?,?)";
    con.query(dashStr, [credUserID], function (err, res) {
      if (err) throw err;
      console.log("Selected...");
      res2.send(JSON.stringify(res));
    });
    //})(credUserID);
  });
});

app.post("/StaffOverSightNode", function (req, res, next) {
  console.log("Entering this");
  console.log(req.body.InspState);
  var stateVar = req.body.InspState;
  //con.connect(function(err){
  //if (err) throw err;
  //var sql = "CREATE DATABASE OverSightNode";
  var sql = "SELECT * FROM Inspectors WHERE InspState = ?";
  con.query(sql, [stateVar], function (err, result) {
    if (err) throw err;
    console.log("Selection made!");
    console.log(result);
    console.log(result.length);
    var inspObj = new Object();
    inspObj.firstName = [];
    for (var b = 0; b < result.length; b++) {
      inspObj.firstName.push(result[b].InspFirstName);
    }
    //console.log(result[0].InspFirstName);
    //res.send(JSON.stringify({FirstName: result[0].InspFirstName}));
    res.send(JSON.stringify(inspObj));
  });
  //con.end();
  console.log("Connection made");
  //});
});

app.post("/Autocomplete", function (req, res, next) {
  console.log("Autocompleting Company Name");

  console.log(req.body.regNoC);
  var stateVar = req.body.regNoC;
  console.log("LIKE value: " + stateVar);

  //var sql = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductCategoryName, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductCategory3 ON Company.CompanyID = ProductCategory3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE CompanyName LIKE ?";
  //var sql = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductCategoryName, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductCategory3 ON Company.CompanyID = ProductCategory3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID WHERE CompanyName LIKE ?";
  var sql =
    "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE CompanyName LIKE ?";
  /*
		var sql = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName,"+
			" Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets,"+
			" FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON"+
			" Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID"+
			" INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON"+
			" Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN"+
			" DosageForms ON Product4.ProductDF = DosageForms.DosFormsID LEFT JOIN Findings4 ON"+
			" Product4.ProductID = Findings4.ProductID WHERE CompanyName LIKE ?";
		*/
  con.query(sql, [stateVar + "%"], function (err, result) {
    if (err) throw err;
    console.log("Entire selection made!");
    console.log(result);
    console.log(result.length);
    var inspObj = new Object();
    /*
				CompanyName: 'Madrigala',
				CompanyAdd: 'fsfs',
				Latitude: 9.01927,
				Longitude: 7.45803,
				State: 'Abia',
				ContactPerson: 'u@nb.com',
				CompanyEmail: 'FSF'
				*/
    inspObj.companyName = {};
    inspObj.companyName.name = [];
    inspObj.companyName.add = [];

    inspObj.companyName = []; //bundle Name and address object? = [{name:, addd:,}]
    inspObj.companyAdd = [];
    inspObj.latitude = [];
    inspObj.longitude = [];
    inspObj.state = [];
    inspObj.contactPerson = [];
    inspObj.companyEmail = [];
    inspObj.productCategoryName = [];
    inspObj.productLineName = [];
    inspObj.dosFormsType = [];
    inspObj.prodKey = [];
    inspObj.productName = [];
    inspObj.productStrength = [];
    inspObj.NRN = [];
    inspObj.subClassName = [];
    inspObj.genName = [];
    inspObj.FindingImg = [];
    inspObj.FindingDets = [];
    inspObj.FindCat = [];
    inspObj.FindObservation = [];
    inspObj.FindingID = [];

    for (var b = 0; b < result.length; b++) {
      inspObj.companyName.push({
        name: result[b].CompanyName,
        add: result[b].CompanyAdd,
      });
      //inspObj.companyName.
      //inspObj.companyAdd.push(result[b].CompanyAdd); //comment this one out
      inspObj.latitude.push(result[b].Latitude);
      inspObj.longitude.push(result[b].Longitude);
      inspObj.state.push(result[b].State);
      inspObj.contactPerson.push(result[b].ContactPerson);
      inspObj.companyEmail.push(result[b].CompanyEmail);
      inspObj.productCategoryName.push(result[b].ProductCategoryName);
      inspObj.productLineName.push(result[b].ProductLineName);
      inspObj.dosFormsType.push(result[b].DosFormsType);
      inspObj.prodKey.push(result[b].ProductID);
      inspObj.productName.push(result[b].ProductName);
      inspObj.productStrength.push(result[b].ProductStrength);
      inspObj.NRN.push(result[b].NRN);
      inspObj.subClassName.push(result[b].SubClassName);
      inspObj.genName.push(result[b].GenName);
      inspObj.FindingImg.push(result[b]);
      inspObj.FindingDets.push(result[b].FindingDets);
      inspObj.FindCat.push(result[b].FindCat);
      inspObj.FindObservation.push(result[b].FindObservation);
      inspObj.FindingID.push(result[b].FindingID);
    }
    //console.log(result[0].InspFirstName);
    //res.send(JSON.stringify({FirstName: result[0].InspFirstName}));
    res.send(JSON.stringify(inspObj));
  });
  //con.end();
  console.log("Connection made");
});

app.post("/AutocompleteDash", function (req, res, next) {
  console.log("Autocompleting Company Name for Dash");

  console.log(req.body.searchCompName);
  var stateVar = req.body.searchCompName;
  console.log("LIKE value: " + stateVar);

  //var sql = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductCategoryName, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductCategory3 ON Company.CompanyID = ProductCategory3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE CompanyName LIKE ?";
  //var sql = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductCategoryName, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductCategory3 ON Company.CompanyID = ProductCategory3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID WHERE CompanyName LIKE ?";
  var sql =
    "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE CompanyName LIKE ?";
  /*
		var sql = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName,"+
			" Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets,"+
			" FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON"+
			" Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON Company.CompanyID = ProductLine.CompanyID"+
			" INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON"+
			" Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN"+
			" DosageForms ON Product4.ProductDF = DosageForms.DosFormsID LEFT JOIN Findings4 ON"+
			" Product4.ProductID = Findings4.ProductID WHERE CompanyName LIKE ?";
		*/
  con.query(sql, [stateVar + "%"], function (err, result) {
    if (err) throw err;
    console.log("Entire selection made!");
    console.log(result);
    console.log(result.length);
    var inspObj = new Object();
    /*
				CompanyName: 'Madrigala',
				CompanyAdd: 'fsfs',
				Latitude: 9.01927,
				Longitude: 7.45803,
				State: 'Abia',
				ContactPerson: 'u@nb.com',
				CompanyEmail: 'FSF'
				*/
    inspObj.companyName = {};
    inspObj.companyName.name = [];
    inspObj.companyName.add = [];

    inspObj.companyName = []; //bundle Name and address object? = [{name:, addd:,}]
    inspObj.companyAdd = [];
    inspObj.latitude = [];
    inspObj.longitude = [];
    inspObj.state = [];
    inspObj.contactPerson = [];
    inspObj.companyEmail = [];
    inspObj.productCategoryName = [];
    inspObj.productLineName = [];
    inspObj.dosFormsType = [];
    inspObj.prodKey = [];
    inspObj.productName = [];
    inspObj.productStrength = [];
    inspObj.NRN = [];
    inspObj.subClassName = [];
    inspObj.genName = [];
    inspObj.FindingImg = [];
    inspObj.FindingDets = [];
    inspObj.FindCat = [];
    inspObj.FindObservation = [];
    inspObj.FindingID = [];

    for (var b = 0; b < result.length; b++) {
      inspObj.companyName.push({
        name: result[b].CompanyName,
        add: result[b].CompanyAdd,
      });
      //inspObj.companyName.
      //inspObj.companyAdd.push(result[b].CompanyAdd); //comment this one out
      inspObj.latitude.push(result[b].Latitude);
      inspObj.longitude.push(result[b].Longitude);
      inspObj.state.push(result[b].State);
      inspObj.contactPerson.push(result[b].ContactPerson);
      inspObj.companyEmail.push(result[b].CompanyEmail);
      inspObj.productCategoryName.push(result[b].ProductCategoryName);
      inspObj.productLineName.push(result[b].ProductLineName);
      inspObj.dosFormsType.push(result[b].DosFormsType);
      inspObj.prodKey.push(result[b].ProductID);
      inspObj.productName.push(result[b].ProductName);
      inspObj.productStrength.push(result[b].ProductStrength);
      inspObj.NRN.push(result[b].NRN);
      inspObj.subClassName.push(result[b].SubClassName);
      inspObj.genName.push(result[b].GenName);
      inspObj.FindingImg.push(result[b]);
      inspObj.FindingDets.push(result[b].FindingDets);
      inspObj.FindCat.push(result[b].FindCat);
      inspObj.FindObservation.push(result[b].FindObservation);
      inspObj.FindingID.push(result[b].FindingID);
    }
    //console.log(result[0].InspFirstName);
    //res.send(JSON.stringify({FirstName: result[0].InspFirstName}));
    res.send(JSON.stringify(inspObj));
  });
  //con.end();
  console.log("Connection made");
});

app.post("/DFOverSight", function (req, res, next) {
  console.log("Autocompleting Dosage Forms Type");

  console.log(req.body.regPLL[0].PL.ProdLineCat);
  var stateVar = req.body.regPLL[0].PL.ProdLineCat;

  var sql = "SELECT * FROM DosageForms WHERE " + stateVar + "= ?";

  con.query(sql, [stateVar], function (err, result) {
    if (err) throw err;
    console.log("DosageForms found!");
    console.log(result);
    console.log(result.length);

    var inspObj = new Object();
    inspObj.dosageForm = [];
    for (var b = 0; b < result.length; b++) {
      inspObj.dosageForm.push(result[b].DosFormsType);
    }
    //console.log(result[0].InspFirstName);
    //res.send(JSON.stringify({FirstName: result[0].InspFirstName}));
    res.send(JSON.stringify(inspObj));
  });
  //con.end();
  console.log("Connection made");
  //});
});

app.get("/bringInspector", function (req, res2) {
  console.log("Bringing up inspectors now");
  console.log(req.query);
  console.log(req.query.statInfo);
  var statInfo = req.query.statInfo;
  //res2.send(JSON.stringify('Bringing up inspectors.'));

  var inspectorStr = "SELECT * FROM Inspectors WHERE InspState = ?";

  con.query(inspectorStr, [statInfo], function (err, res) {
    if (err) throw err;

    console.log("Selected Inspectors");
    console.log(res);
    res2.send(JSON.stringify(res));
  });
});

app.get("/bringInspection", function (req, res2) {
  console.log("Bringing up inspection now");
  console.log(req.query);
  var inspType = req.query.inspType;
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;
  var staType = req.query.staType;

  //res2.send(JSON.stringify('Bringing up inspectors.'));
  //var inspectorStr = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE InspTypeName = ?";
  //var inspectorStr= "SELECT * FROM Inspectors WHERE InspState = 'Ogun'";
  if (inspType) {
    console.log("Entered first...");
    var queryInspTypeStr =
      "SELECT InspTypeID FROM InspectionType WHERE InspTypeName = ?";
    con.query(queryInspTypeStr, [inspType], (req, res1) => {
      console.log("This is res1", res1);
      console.log(res1[0].InspTypeID);
      var inspTypeID = res1[0].InspTypeID;
      var queryStr =
        "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus, InspectionType.InspTypeName, InspFirstName, InspLastName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN Inspectors ON Inspection.InspectorID = Inspectors.InspectorID WHERE Inspection.InspTypeID = ? AND InspDate >= ? AND InspDate <= ? AND State = ?  AND Inspection.InspStatus = 'Pending' AND InspEndStatus IS NULL";
      //"SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus, InspectionType.InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN Product4 ON Inspection.ProductLineID = Product4.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID WHERE Inspection.InspTypeID = ? AND InspDate BETWEEN ? AND ? AND State = ?  AND InspStatus = 'Pending'";
      //"SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus, InspectionType.InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN Product4 ON Inspection.ProductLineID = Product4.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE Inspection.InspTypeID = ? AND InspDate BETWEEN ? AND ? AND State = ?  AND InspStatus = 'Pending'";
      //"SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus, InspectionType.InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN Product4 ON Inspection.ProductLineID = Product4.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID WHERE InspDate BETWEEN ? AND ? AND State = ?  AND InspStatus = 'Pending'";
      con.query(queryStr, [inspTypeID, fromDate, toDate, staType], function (
        err,
        res
      ) {
        if (err) throw err;

        console.log("Selected Inspections");
        console.log(res);
        console.log(res.length);
        res2.send(JSON.stringify(res));
      });
    });
  } else {
    console.log("Entered Second...");
    /*
    var queryStr =
      "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN Product4 ON Inspection.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE InspDate BETWEEN ? AND ? AND State = ?  AND InspStatus = 'Pending'";
  
    var queryStr =
      "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus, InspectionType.InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN Product4 ON Inspection.ProductLineID = Product4.ProductLineID INNER JOIN InspectionType ON Product4.ProductID = InspectionType.InspTypeID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID LEFT JOIN Findings4 ON Product4.ProductID = Findings4.ProductID WHERE InspDate BETWEEN ? AND ? AND State = ?  AND InspStatus = 'Pending'";
    */

    var queryStr =
      "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus, InspectionType.InspTypeName, InspFirstName, InspLastName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN Inspectors ON Inspection.InspectorID = Inspectors.InspectorID WHERE InspDate >= ? AND InspDate <= ? AND State = ?  AND Inspection.InspStatus = 'Pending' AND InspEndStatus IS NULL";
    //"SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus, InspectionType.InspTypeName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN Product4 ON Inspection.ProductLineID = Product4.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID WHERE InspDate BETWEEN ? AND ? AND State = ?  AND InspStatus = 'Pending'";
    con.query(queryStr, [fromDate, toDate, staType], function (err, res) {
      if (err) throw err;

      console.log("Selected Inspections");
      console.log(res.length);
      //console.log(res);
      res2.send(JSON.stringify(res));
    });
  }
});

app.get("/inspectorInspections", function (req, res2) {
  console.log("Name and spliting...");
  console.log(req.query);
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;
  var inspNameArr = req.query.inspectorName.split(" ");
  console.log(inspNameArr);
  var queryStr =
    "SELECT InspectorID FROM Inspectors WHERE InspLastName = ? AND InspFirstName = ?";
  con.query(queryStr, [inspNameArr[0], inspNameArr[1]], function (err, res) {
    if (err) throw err;

    console.log("Selected Inspections for inspector");
    console.log(res.length);
    console.log(res);
    console.log(res[0].InspectorID);
    var inspIndex = res[0].InspectorID;
    var queryStr2 =
      "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType, FindingImg, FindingDets, FindCat, FindObservation, FindingID, InspectionID, Inspector, InspDate, InspTypeName, InspStatus FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID INNER JOIN Product4 ON ProductLine.ProductLineID = Product4.ProductLineID INNER JOIN SubClass ON Product4.ProductSubClass=SubClass.SubClassID INNER JOIN Generic ON Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormID INNER JOIN InspectionProducts ON Product4.ProductID = InspectionProducts.ProductID LEFT JOIN Findings4 ON InspectionProducts.ProductID = Findings4.ProductID AND InspectionProducts.InspectionID = Findings4.InspID WHERE Inspector = ? AND InspDate BETWEEN ? AND ?";
    con.query(queryStr2, [inspIndex, fromDate, toDate], function (err, res3) {
      console.log(res3);
      res2.send(JSON.stringify(res3));
    });
  });
});

app.post("/commitInspection", function (req, res2) {
  console.log("hitting...");
  //console.log(JSON.parse(req.body));
  console.log("-------");
  console.log(req.body);

  var nameArr = req.body.inspector.split(" ");
  console.log("This is name array: ", nameArr);

  console.log(req.body.inspector);
  console.log("?????????--");
  console.log(req.body.nowArr);
  var reqBody = req.body;
  var nowObj = req.body.nowArr;
  console.log(nowObj);
  var nowObjCompanyName = nowObj.map((arrItem) => {
    return arrItem.slice(0, arrItem.indexOf("("));
  });
  var nowObjPLName = nowObj.map((arrItem) => {
    return arrItem.slice(arrItem.indexOf("(") + 1, arrItem.indexOf("|") - 1);
  });
  var nowObjAddName = nowObj.map((arrItem) => {
    return arrItem.slice(arrItem.indexOf("|") + 1, arrItem.lastIndexOf("("));
  });

  var nowObjInspName = nowObj.map((arrItem) => {
    return arrItem.slice(
      arrItem.lastIndexOf("(") + 1,
      arrItem.lastIndexOf(")")
    );
  });

  var nowObjProdCat = nowObj.map((arrItem) => {
    return arrItem.slice(arrItem.indexOf("*") + 1, arrItem.lastIndexOf("*"));
  });

  var nowObjProdName = nowObj.map((arrItem) => {
    return arrItem.slice(arrItem.indexOf("(") + 1, arrItem.indexOf(")"));
  });
  //var addName = item.slice(item.indexOf("|") + 1, item.lastIndexOf("("));
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log(nowObjCompanyName);
  console.log(nowObjPLName);
  console.log(nowObjAddName);
  console.log(nowObjInspName);
  console.log(nowObjProdCat);
  console.log(nowObjProdName);

  nowObjCompanyName.forEach((arrItem, i) => {
    var companyStr = "SELECT CompanyID FROM Company WHERE CompanyName = ?";
    con.query(companyStr, [nowObjCompanyName[i]], function (err, res) {
      if (err) throw err;
      console.log(res);
      console.log(res[0].CompanyID);
      var companyId = res[0].CompanyID;
      var companyAddStr =
        "SELECT CompanyAddID FROM CompanyAddress3 WHERE CompanyID = ? AND CompanyAdd = ?";
      con.query(companyAddStr, [companyId, nowObjAddName[i]], function (
        err,
        res
      ) {
        if (err) throw err;
        console.log("Address: ", res[0].CompanyAddID);
        var companyAddId = res[0].CompanyAddID;
        console.log(nowObjProdCat);
        var prodCatStr =
          "SELECT ProductCatID FROM ProductCategory3 WHERE ProductCategoryName = ?";
        con.query(prodCatStr, [nowObjProdCat[i]], function (err, res) {
          if (err) throw err;
          console.log("Category, ", res[0].ProductCatID);
          var prodCatID = res[0].ProductCatID;
          var pLStr =
            "SELECT ProductLineID FROM ProductLine WHERE CompanyID = ? AND CompAddID = ? AND ProductLineName = ? AND ProductCatID= ?";
          console.log(`This is productCatID ${prodCatID}`);

          con.query(
            pLStr,
            [companyId, companyAddId, nowObjPLName[i], prodCatID],
            function (err, res) {
              if (err) throw err;
              console.log("This is the ProductLineID");
              console.log(res);
              console.log(companyId, companyAddId, nowObjPLName[i], prodCatID);
              console.log(res[0].ProductLineID);
              var prodLineId = res[0].ProductLineID;

              var prodStr =
                "SELECT ProductID FROM Product4 WHERE ProductLineID = ?  AND CompID = ?";
              console.log(nowObjProdName[i]);
              console.log(prodLineId);
              con.query(prodStr, [prodLineId, companyId], (req, res) => {
                if (err) throw err;
                console.log(res);
                var prodArr = res;
                console.log("ProductID: ", res[0].ProductID);
                var productId = res[0].ProductID;

                var inspectorStr =
                  "SELECT InspectorID FROM Inspectors WHERE InspFirstName = ? AND InspLastName = ?";
                con.query(
                  inspectorStr,
                  [nameArr[1], nameArr[0]],
                  (req, res) => {
                    if (err) throw err;
                    console.log("Inspector is: ", res[0].InspectorID);
                    var inspectorID = res[0].InspectorID;

                    var inspectionTypeStr =
                      "SELECT InspTypeID FROM InspectionType WHERE InspTypeName = ?";

                    con.query(
                      inspectionTypeStr,
                      [nowObjInspName[i]],
                      (req, res) => {
                        if (err) throw err;
                        console.log(
                          "This is the inspection type: ",
                          res[0].InspTypeID
                        );
                        var inspTypeId = res[0].InspTypeID;

                        //"UPDATE Dashboard SET ModDate = NOW(), SavData = ?, DashStatus = ? WHERE DashboardID =?";
                        inpsectionInsertStr =
                          "INSERT INTO Inspection (InspDate, InspTypeID, InspectorID, ProductLineID, ProductCatID, CompanyAddressID, CompanyID, InspStatus) VALUES (NOW(),?,?,?,?,?,?,?)";
                        con.query(
                          inpsectionInsertStr,
                          [
                            inspTypeId,
                            inspectorID,
                            prodLineId,
                            prodCatID,
                            companyAddId,
                            companyId,
                            "Assigned",
                          ],
                          (req, res) => {
                            if (err) throw err;
                            console.log("Gotten here now");
                            console.log(res.insertId);
                            var inspId = res.insertId;

                            //under
                            reqBody.inspIDArrId[i].forEach((arrItem, i) => {
                              //another forEach here
                              //   arrItem.forEach((arrItem2, j) => {
                              console.log("Here are InspectionIDs " + arrItem);
                              inpsectionUpdateStr =
                                "UPDATE Inspection SET InspStatus = 'Assigned', newInsertId = ?, newInsertIdDate = NOW() WHERE InspectionID = ?"; //we are leaving the original inspectors in place, it doesn't matter. All their pending inpsections have been re-assigned to the  INSERT insepctor.
                              console.log(
                                "Current value newInsertID: ",
                                inspId
                              );
                              con.query(
                                inpsectionUpdateStr,
                                [inspId, arrItem],
                                (req, res) => {
                                  if (err) throw err;
                                  console.log("Update on commit");
                                  console.log(res);
                                  if (i == reqBody.inspIDArrId.length) {
                                    //to send once, to prevent error;
                                    res2.send("Done");
                                  }
                                }
                              );
                              // });
                            });

                            var inspProdStr =
                              "INSERT INTO InspectionProducts (InspectionID, ProductID, InspDate, InspTypeName, Inspector) VALUES (?, ?, NOW(), ?, ?)";
                            prodArr.forEach((prodItem) => {
                              con.query(inspProdStr, [
                                inspId,
                                prodItem.ProductID,
                                nowObjInspName[i],
                                inspectorID,
                              ]);
                            });
                            // res2.send("Updated");
                          }
                        ); //
                      }
                    );
                  }
                );
              });
            }
          ); //productLine
        });
      });
    });
  });
});

//Get pending inspections.
app.get("/getPendingInpInspr", function (req, res) {
  console.log("#####");
  //console.log(JSON.parse(req.query));
  console.log("!!!!");
  var state = req.query.state;
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;
  var inspOfficial = req.query.inspector.split(" ");
  //var inspType = req.query.inspType;
  console.log(req.query.inspector);
  var inspOfficialArr = req.query.inspector.split(",");
  //console.log(inspType);
  console.log(inspOfficialArr);

  var querySubStr = "";
  inspOfficialArr.forEach((arr, i) => {
    var inspSplit = arr.split(" ");
    querySubStr +=
      " (InspLastName ='" +
      inspSplit[0] +
      "' AND InspFirstName = '" +
      inspSplit[1] +
      "') OR";
  });
  console.log(querySubStr);
  var querySubStr2 = querySubStr.slice(0, querySubStr.length - 2);
  console.log(typeof querySubStr2);
  console.log(querySubStr2);
  /*
  var queryStr =
    "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus, InspectionType.InspTypeName, Inspectors.InspectorID FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN Inspectors ON Inspection.InspectorID = Inspectors.InspectorID WHERE InspDate >= ? AND InspDate <= ? AND State = ? AND InspFirstName = ? AND InspLastName = ?  AND Inspection.InspStatus = 'Assigned' AND InspEndStatus IS NULL";
*/
  var queryStr =
    "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName, Inspection.InspectionID, Inspection.InspDate, Inspection.InspStatus, InspectionType.InspTypeName, Inspectors.InspectorID, Inspectors.InspFirstName, Inspectors.InspLastName FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON CompanyAddress3.CompanyAddID = ProductLine.CompAddID AND CompanyAddress3.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN Inspectors ON Inspection.InspectorID = Inspectors.InspectorID WHERE InspDate >= ? AND InspDate <= ? AND State = ? AND Inspection.InspStatus = 'Assigned' AND InspEndStatus IS NULL AND" +
    querySubStr2;

  console.log("@@");
  console.log(queryStr);
  con.query(
    queryStr,
    [fromDate, toDate, state, inspOfficial[1], inspOfficial[0]],
    (err, res1) => {
      if (err) throw err;
      console.log("_________________");
      //console.log(res1);
      res.send(JSON.stringify(res1));
      console.log("_________________");
      console.log(querySubStr2);
    }
  );
});

app.post("/deCommitInspection", (req, res2) => {
  console.log(req.body);

  var decomitArr = req.body.InspDetail.split("|"); //getting inspection detail
  var decomitInspector = req.body.inspector;
  var decomitInspectorArr = decomitInspector.split(" ");
  console.log(decomitInspectorArr[1]);
  console.log(decomitInspectorArr[0]);
  console.log(decomitArr);

  var deCommitAddStr1 =
    "SELECT CompanyAddID FROM CompanyAddress3 WHERE CompanyAdd = ?";
  //"UPDATE Inspection SET InspEndStatus = 'Assigned', newInsertId = ? WHERE InspectionID = ?";
  con.query(deCommitAddStr1, [decomitArr[1]], (err, res1) => {
    if (err) throw err;
    var compAddId = res1[0].CompanyAddID;

    var deCommitPLStr2 =
      "SELECT ProductLineID FROM ProductLine WHERE ProductLineName = ?";
    con.query(deCommitPLStr2, [decomitArr[2]], (err, res) => {
      if (err) throw err;
      var PLID = res[0].ProductLineID;

      var decomitInspTypeStr =
        "SELECT InspTypeID FROM InspectionType WHERE InspTypeName = ?";

      con.query(decomitInspTypeStr, [decomitArr[3]], (err, res) => {
        if (err) throw err;
        var inspTypeId = res[0].InspTypeID;
        console.log("DeCommit InspTypeID", inspTypeId);
        var decommitInspectorStr =
          "SELECT InspectorID FROM Inspectors WHERE InspFirstName = ? AND InspLastName = ?";
        con.query(
          decommitInspectorStr,
          [decomitInspectorArr[1], decomitInspectorArr[0]],
          (err, res) => {
            if (err) throw err;
            var inspectorId = res[0].InspectorID;
            console.log("DEcommit InspectorID: ", inspectorId);
            var selectNewInsertIDStr =
              "SELECT * FROM Inspection WHERE InspTypeID = ? AND ProductLineID = ? AND CompanyAddressID = ? AND InspStatus = 'Assigned' AND InspEndStatus IS NULL";
            //"SELECT * FROM Inspection WHERE InspTypeID = ? AND InspectorID = ? AND ProductLineID = ? AND CompanyAddressID = ? AND InspStatus = 'Assigned' AND InspEndStatus IS NULL";
            con.query(
              selectNewInsertIDStr,
              [inspTypeId, PLID, compAddId],
              (err, res) => {
                if (err) throw err;
                console.log(
                  "InspType",
                  inspTypeId,
                  " , ",
                  "Inspector",
                  inspectorId,
                  "ProductLine",
                  PLID,
                  "CompanyAddress",
                  compAddId
                );
                console.log("This is decommited newInsertId: ", res);
                //console.log(res);
                var newInsertID = res[0].newInsertId; //we're taking it from the bottom, that is the latest;
                var newInsertInspID = res[0].InspectionID; //we're taking it from the bottom, that is the latest;
                console.log("This is newInsertID ", newInsertID);
                console.log(
                  "This is new Inserted record InspID ",
                  newInsertInspID
                );
                var resArr = [];
                res.forEach((resItem) => {
                  resArr.push(resItem.InspectionID);
                });
                console.log(
                  "Below is resArr -an array containing the IDs of assigned inspection records to be deassigned"
                );
                console.log(resArr);
                //Now, we update deAssignDate column,to be able to track those who have been deAssigned in cases of appraisal
                var decomitInspStr =
                  "UPDATE Inspection SET InspStatus = 'Pending', InspEndStatus = NULL, newInsertId = NULL, newInsertIdDate = NULL, deAssignDate = NOW() WHERE newInsertId = ?";
                //"UPDATE Inspection SET InspStatus = 'Pending', InspEndStatus = NULL, newInsertId = NULL WHERE InspectionID = ?";
                //"UPDATE Inspection SET InspStatus = 'Pending', InspEndStatus = NULL, newInsertId = NULL WHERE InspTypeID = ? AND InspectorID = ? AND ProductLineID = ? AND CompanyAddressID = ? AND InspStatus = 'Pending' AND InspEndStatus = 'Assigned'";
                // resArr.forEach((resArrItem) => {
                //updating assigned records, back to deCommit;
                con.query(decomitInspStr, [newInsertID], (err, res) => {
                  if (err) throw err;
                  console.log(
                    "InspType",
                    inspTypeId,
                    " , ",
                    "Inspector",
                    inspectorId,
                    "ProductLine",
                    PLID,
                    "CompanyAddress",
                    compAddId
                  );
                  console.log(res);

                  var deleteDeCommitStr =
                    "DELETE FROM Inspection WHERE InspectionID = ?";
                  con.query(deleteDeCommitStr, [newInsertID], (err, res) => {
                    if (err) throw err;
                    console.log("Deleted");
                    console.log(res);
                    //res2.send("Decommited");
                    //We need this info to set the highlight on the client, where the inspection has just been decommitted
                    res2.send(
                      JSON.stringify({
                        inspectionDetail: {
                          compName: decomitArr[0],
                          compAdd: decomitArr[1],
                          prodLine: decomitArr[2],
                          inspType: decomitArr[3],
                        },
                      })
                    );
                  });
                });
                // });
              }
            );
          }
        );
      });
    });
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
