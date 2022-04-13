
//require("connectionStr-final.php");
var express= require ('express');
var router = express.Router();
var mysql = require ('mysql');
const fileUpload = require('express-fileupload');

var con = mysql.createConnection ({
	host:'localhost',
	user:'root',
	password:'root',
	database:'OverSightNode',
	socketPath:'/Applications/MAMP/tmp/mysql/mysql.sock'
});

router.get('/SearchAjaxRandRInterfaceNoC3', function (req, res, next){
	console.log('Hitting this.');
	//res.render ('overSightHtml');
	//res.render('OverSightOpt9-Node');
});


/*


$NoC = $_POST['regNoC'];

$doc = new DOMDocument("1.0");
$doc->formatOutput = true;

//echo ('Things are working!');
			
$connection = mysqli_connect('nafdacoversightcom1.ipagemysql.com', $userN, $passW);

if (!$connection) { die('Not connected'. mysqli_error());}
//echo ('Things are working2!');

$selectDb = mysqli_select_db($connection, $db_Name);

if (!$selectDb) {die ('cant use database'.mysqli_error());}



$queryStr = "SELECT CompanyName, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail, ProductLineName,".
			" Product4.ProductID, ProductName, ProductStrength, NRN, ProductSubClass, SubClassName, GenName, DosFormsType,".
			" InspectionID, InspDate, InspTypeName, Findings4.FindingImg, Findings4.FindingDets, Findings4.FindCat, Findings4.FindObservation, Findings4.FindingID".
			" FROM Company INNER JOIN CompanyAddress3 ON Company.CompanyID = CompanyAddress3.CompanyID INNER JOIN ProductLine ON".
			" Company.CompanyID = ProductLine.CompanyID INNER JOIN Inspection ON ProductLine.ProductLineID = Inspection.ProductLineID INNER JOIN InspectionType ON".
			" Inspection.InspTypeID = InspectionType.InspTypeID INNER JOIN Findings4 ON Inspection.InspectionID = Findings4.InspID INNER JOIN Product4 ON".
			" Findings4.ProductID = Product4.ProductID INNER JOIN SubClass ON Product4.ProductSubClass = SubClass.SubClassID INNER JOIN Generic ON".
			" Product4.ProductGen = Generic.GenID INNER JOIN DosageForms ON Product4.ProductDF = DosageForms.DosFormsID WHERE DATEDIFF(CURDATE(), InspDate) < 130".
			" ORDER BY ProductLineName, InspDate, InspTypeName, ProductName";



$queryDatabase = mysqli_query($connection, $queryStr);


if (!$queryDatabase) {Die ('No results '.mysqli_error($connection));}
//echo ('Things are working4!');

header ("Content-type: text/xml;charset=utf-8");
//echo ('Things are working7!');
$node = $doc->createElement("NAF");
$doc->appendChild($node);
//echo count($row = @mysql_fetch_assoc($queryDatabase));
while ($row = @mysqli_fetch_assoc($queryDatabase)) {
	$node2 =$doc->createElement('Det');
	
	$node2->setAttribute("NoC", $row['CompanyName']);
	
	
	
	$nodeLat =$doc->createElement('Latitude');
	$nodeLatText =$doc->createTextNode($row['Latitude']);
	$nodeLat->appendChild($nodeLatText);
	$node2->appendChild($nodeLat);
	
	$nodeLong =$doc->createElement('Longitude');
	$nodeLongText =$doc->createTextNode($row['Longitude']);
	$nodeLong->appendChild($nodeLongText);
	$node2->appendChild($nodeLong);
	
	
	
	$nodeCompAddress =$doc->createElement('CompanyAddress');
	$nodeCompAddressText =$doc->createTextNode($row['CompanyAdd']);
	$nodeCompAddress->appendChild($nodeCompAddressText);
	$node2->appendChild($nodeCompAddress);
	
	
	
	$nodePlace =$doc->createElement('State');
	$nodePlaceText =$doc->createTextNode($row['State']);
	$nodePlace->appendChild($nodePlaceText);
	$node2->appendChild($nodePlace);
	
	$nodeContactPerson =$doc->createElement('ContactPerson');
	$nodeContactPersonText =$doc->createTextNode($row['ContactPerson']);
	$nodeContactPerson->appendChild($nodeContactPersonText);
	$node2->appendChild($nodeContactPerson);
	
	$nodeContactEmail =$doc->createElement('CompanyEmail');
	$nodeContactEmailText =$doc->createTextNode($row['CompanyEmail']);
	$nodeContactEmail->appendChild($nodeContactEmailText);
	$node2->appendChild($nodeContactEmail);
	
	$nodeInspType =$doc->createElement('InspType');
	$nodeInspTypeText =$doc->createTextNode($row['InspTypeName']);
	$nodeInspType->appendChild($nodeInspTypeText);
	$node2->appendChild($nodeInspType);
	
	$nodeProductLine =$doc->createElement('PL');
	$nodeProductLineText =$doc->createTextNode($row['ProductLineName']);
	$nodeProductLine->appendChild($nodeProductLineText);
	$node2->appendChild($nodeProductLine);
	
	$nodeProductKey =$doc->createElement('ProdKey');
	$nodeProductKeyText =$doc->createTextNode($row['ProductID']); 
	$nodeProductKey->appendChild($nodeProductKeyText);
	$node2->appendChild($nodeProductKey);
	
	$nodePN =$doc->createElement('ProductName');
	$nodePNText =$doc->createTextNode($row['ProductName']);
	$nodePN->appendChild($nodePNText);
	$node2->appendChild($nodePN);
	
	$nodeSC = $doc->createElement('SubClass');
	$nodeSCText = $doc->createTextNode($row['SubClassName']);
	$nodeSC->appendChild($nodeSCText);
	$node2->appendChild($nodeSC);
	
	$nodeGen = $doc->createElement('Gen');
	$nodeGenText = $doc->createTextNode($row['GenName']);
	$nodeGen->appendChild($nodeGenText);
	$node2->appendChild($nodeGen);
	
	
	$nodeDF =$doc->createElement('DosageForm');
	$nodeDFText =$doc->createTextNode($row['DosFormsType']);
	$nodeDF->appendChild($nodeDFText);
	$node2->appendChild($nodeDF);
	
	$nodeS =$doc->createElement('Strength');
	$nodeSText =$doc->createTextNode($row['ProductStrength']);
	$nodeS->appendChild($nodeSText);
	$node2->appendChild($nodeS);
	
	$nodeNRN =$doc->createElement('NRN');
	$nodeNRNText =$doc->createTextNode($row['NRN']);
	$nodeNRN->appendChild($nodeNRNText);
	$node2->appendChild($nodeNRN);
	
	
	$nodeFindKey =$doc->createElement('FindKey');
	$nodeFindKeyText =$doc->createTextNode($row['FindingID']);
	$nodeFindKey->appendChild($nodeFindKeyText);
	$node2->appendChild($nodeFindKey);
	
	$nodeFindDets =$doc->createElement('FindDets');
	$nodeFindDetsText =$doc->createTextNode($row['FindingDets']);
	$nodeFindDets->appendChild($nodeFindDetsText);
	$node2->appendChild($nodeFindDets);
	
	$nodeFindImg =$doc->createElement('FindImg');
	$nodeFindImgText =$doc->createTextNode($row['FindingImg']);
	$nodeFindImg->appendChild($nodeFindImgText);
	$node2->appendChild($nodeFindImg);
	
	
	$nodeFindCat =$doc->createElement('FindCat');
	$nodeFindCatText =$doc->createTextNode($row['FindCat']);
	$nodeFindCat->appendChild($nodeFindCatText);
	$node2->appendChild($nodeFindCat);
	
	$nodeFindObservation =$doc->createElement('FindObs');
	$nodeFindObservationText =$doc->createTextNode($row['FindObservation']);
	$nodeFindObservation->appendChild($nodeFindObservationText);
	$node2->appendChild($nodeFindObservation);
	
	
	$nodeInspID = $doc->createElement('InspID');
	$nodeInspIDText = $doc->createTextNode($row['InspectionID']);
	$nodeInspID->appendChild($nodeInspIDText);
	$node2->appendChild($nodeInspID);
	
	
	$nodeInspDate = $doc->createElement('InspDate');
	$nodeInspDateText = $doc->createTextNode($row['InspDate']);
	$nodeInspDate->appendChild($nodeInspDateText);
	$node2->appendChild($nodeInspDate);
	
	
	$node->appendChild($node2);
}


echo $doc->saveXML();


*/