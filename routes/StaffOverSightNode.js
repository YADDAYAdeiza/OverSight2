var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

$doc = new DOMDocument("1.0");
$doc->formatOutput = true;

$stateVar = $_POST['InspState'];

$dbConn = mysqli_connect ('nafdacoversightcom1.ipagemysql.com', $userN, $passW, $db_Name);

if (!$dbConn) {
die ('Could not connect: '.mysqli_error($dbConn));
}

$sql = "SELECT * FROM Inspectors WHERE InspState = '$stateVar'";
$result = mysqli_query($dbConn, $sql);

header ("Content-type: text/xml;charset=utf-8");

$node = $doc->createElement("NAF");
$doc->appendChild($node);

while ($row = mysqli_fetch_assoc($result)){
	//echo $row['InspFirstName'];
	$node2 =$doc->createElement('Det');
	$node2->setAttribute("lName", $row['InspLastName']);
	$node2->setAttribute("fName", $row['InspFirstName']);
	$node->appendChild($node2);	
}

echo $doc->saveXML();


