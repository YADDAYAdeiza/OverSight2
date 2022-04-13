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


router.get('/', function (req, res, next){
	//res.render ('overSightHtml');
	res.render('OverSightOpt9-Node');
});

router.post('/extractData', function (req, res, next) {
	
	con.connect(function(err){
		if (err) throw err;
		//var sql = "CREATE DATABASE OverSightNode";
		var sql = "CREATE TABLE CompanyInfo(Name varchar (20), Address varchar (30))";
		con.query(sql, function(err,res){
			if(err) throw err;
			console.log('Table Createda!');
		});
		console.log('Connection made');
	});
	
});

/*
router.post('/registrationMapNoC-Node', function (req, res, next){
	res.send('This is name of company: ' + req.body.regNoC +', And this is the Latitude: '+ req.body.regLat);
});
*/

router.post('/registrationMapNoC-Node', function (req, res, next) {
	var regNoC = req.body.regNoC;
	var regEmail = req.body.regEmail;
	var regLat = req.body.regLat;
	var regLong = req.body.regLong;
	var regCompAddress = req.body.regCompAddress;
	var regPlace = req.body.regPlace;
	var regContPers = req.body.regContPers;
	var regTL = req.body.regTL;
	console.log('Global Team Leader: '+regTL);
	console.log('Global State: '+regPlace);
	console.log('This is the oversight used 2');
	
	var inspInsertID;
	
	
	var bar = con.connect(function(err){
		if (err) throw err;
			var sql = "SELECT `CompanyID` FROM Company WHERE CompanyName = ?"; //with SELECT we pass res[0].CompanyID
			con.query(sql, [regNoC], function(err, res){
				console.log('This is companyName: '+regNoC);
				if (err) throw err;
				console.log('**********');
				console.log(res);
				console.log('**********');
				if (res[0]) { //If present, call next function
					console.log('This is the CompanyID: '+res[0].CompanyID);
					CompanyAddressUpdate(res[0].CompanyID, regCompAddress, regLat, regLong, regEmail, regPlace, regContPers);
				}else { // If absent, insert fresh data into database and call next function
					sql = "INSERT INTO Company (CompanyID, CompanyName) VALUES (NULL, ?)"; //with INSERT we pass res.insertID
					con.query(sql, [regNoC], function(err,res){
						if (err) throw err;
						console.log('Table Createdal in OverSightNode!');
						console.log(res);
						console.log(res.insertId);
						CompanyAddressUpdate(res.insertId, regCompAddress, regLat, regLong, regEmail, regPlace, regContPers);
					});
				}
			});
			
		});
		


function CompanyAddressUpdate(CompIndex, regCompAddress, regLat, regLong, regEmail, regPlace, regContPers){
		var sql = "SELECT `CompanyAddID`, `Latitude`, `Longitude` FROM CompanyAddress3 WHERE CompanyID= ? AND CompanyAdd = ?";
		con.query(sql, [CompIndex, regCompAddress], function(err, res) {
			console.log(res);
			if (res[0]) {
				console.log('Something here...');
				console.log('--------');
				//Call next function here;
				console.log('TL still: '+regTL);
				console.log('Place still: '+regPlace);
				console.log('Entering if:');
				if(res[0].Latitude ==0) {
				console.log('---------');
					console.log('Updating lat and lng ', res[0].CompanyAddID);
					
				console.log('---------');
					var sql = "UPDATE CompanyAddress3 SET Latitude = " + regLat+ ", Longitude ="  + regLong  + " WHERE CompanyAddID ="+ res[0].CompanyAddID ;
				con.query(sql, function (err, res) {
					if (err) throw err;
				});
				}
				SelectInspector(CompIndex, regTL, regPlace);
			} else {
				console.log('Nothing');
				var sql = "INSERT INTO CompanyAddress3(CompanyAddID,CompanyID, CompanyAdd, Latitude, Longitude, State, ContactPerson, CompanyEmail) VALUES (NULL,?, ?, ?, ?, ?,?,?)";
				con.query(sql, [CompIndex, regCompAddress, regLat, regLong, regPlace, regContPers,regEmail], function (err, res) {
				if (err) throw err;
				//Call next function here;
				console.log('TL still2: '+regTL);
				console.log('Place still2: '+regPlace);
				SelectInspector(CompIndex, regTL, regPlace);
		});
			}
		});		
	
}


	function SelectInspector(CompIndex, regTL, regPlace) {
		console.log('Team Leader is: '+regTL);
		console.log('State is: '+regPlace);
		var sql = "SELECT * FROM Inspectors WHERE InspFirstName =? AND InspState = ?";
		con.query(sql, [regTL, regPlace], function (err, res) {
			if (err) throw err;
			console.log('Queried for Inspector');
			console.log(res);
			console.log(res[0].InspectorID);
			console.log(res[0].SupervisorEmail);
			var inspectorIndex = res[0].InspectorID;
			var supervisorEmail = res[0].SupervisorEmail;
			UpdatePLAndProd(CompIndex, inspectorIndex, regNoC, regPlace, regTL, supervisorEmail);
				
		});
		
		
	}
	
	
	function UpdatePLAndProd(CompIndex, inspectorIndex, regNoC, regPlace, regTL, supervisorEmail){
		var c;
		for (c = 0; c < req.body.regPLL.length;c++) { //Product Line
			console.log('This is the length: '+req.body.regPLL.length);
			console.log('This is the value of c: '+ c);
			console.log('Printing how many times');
			
			//var prodLineNameVar = req.body.regPLL[c].PL.ProdLine;
			var prodLineNameVar = req.body.regPLL[c];
			console.log(prodLineNameVar);
			console.log('*******');
			console.log(prodLineNameVar.PL);
			console.log('--------');
			console.log(prodLineNameVar.PL.ProdLine);
			console.log('??????');
			var prodLineNameVar2 = req.body.regPLL[c].PL.ProdLine;
			console.log('This is ProductLineName: '+prodLineNameVar2);
			
			
			var catVar = req.body.regPLL;
			console.log('This is the category: ');
			//[ { PL: { ProdLineCat: 'Drug' } },
			console.log(catVar[0].PL.ProdLineCat);
			var prodLineNameVar3 = req.body.regPLL[0].PL.ProdLineCat;
			console.log(prodLineNameVar3);
			
			console.log('This is productCat name: '+req.body.regPLL[0].PL.ProdLineCat); //hard-coded.
			console.log('Continuing... !');
			catVar = req.body.regPLL[0].PL.ProdLineCat; //Only one Category is provided, bu this will suffice for as many produtlines
			console.log('This is catVar: '+catVar);
			var prodCatIndex;
			var sqlProdCat = "SELECT * FROM ProductCategory3 WHERE ProductCategoryName = ?";
		(function (c, sqlProdCat) {
			con.query(sqlProdCat, [catVar], function (err, res){
				if (err) throw err;
				console.log('What is here?');
				console.log('Value of c: '+c);
				console.log(res);
				prodCatIndex = res[0].ProductCatID;
				console.log('This is Category index: '+res[0].ProductCatID);
				
					var DFVar = req.body.regPLL[c].PL.DosageForm;
					console.log('This is the dosageForm: '+DFVar);
					var dosFormIndex;
					var sqlDosForm = "SELECT * FROM DosageForms WHERE DosFormsType = ?";
					console.log('Continuing in DosageForms... !');
					//(function(DFVar, c) {
					con.query(sqlDosForm, [DFVar], function (err, res){
						if (err) throw err;
						console.log('Dosage Form query');
						console.log(DFVar);
						console.log(res);
						dosFormIndex = res[0].DosFormId;
						console.log('This is Dosage Form index: '+res[0].DosFormId);
						
						var inspTypeVar = req.body.regPLL[c].PL.ProdLineInspType;
						console.log('This is ProdLineInspType: '+ req.body.regPLL[c].PL.ProdLineInspType);
						console.log('This is ProdLineInspType: '+ inspTypeVar);
						var inspTypeIndex;
						var sqlInspType = "SELECT * FROM InspectionType WHERE InspTypeName = ?";
						console.log('Continuing in ProdLineInspType... !');
						con.query(sqlInspType, [inspTypeVar], function (err, res){
							if (err) throw err;
							console.log(res);
							inspTypeIndex = res[0].InspTypeID;
							console.log('This is Inspection Type index: '+res[0].ProdLineInspType);
							
							var PLVar = req.body.regPLL[c].PL.ProdLine;
							var prodLineIndex;
							var sqlProductLineCheck = "SELECT `ProductLineID` FROM ProductLine WHERE ProductLineName = ? AND CompanyID=?";
			
							con.query(sqlProductLineCheck, [PLVar, CompIndex], function (err, res){
								if (err) throw err;
								console.log(res);
								console.log('This is length of res: '+res.length);
								if (res.length == 1) { 
									for (var a = 0; a<res.length;a++) { //if productline exists, simply insert inspections
										prodLineIndex = res[a].ProductLineID;
										console.log('This is ProdLine index a: '+res[a].ProductLineID);
											
											var sqlInsp = "INSERT INTO Inspection (`InspDate`, `InspTypeID`, `InspectorID`, `ProductLineID`, `ProductCatID`, `CompanyID`) VALUES (NOW(),?,?,?,?,?)";
											con.query(sqlInsp, [inspTypeIndex,inspectorIndex, prodLineIndex, prodCatIndex,CompIndex], function (err, res){
												if (err) throw err;
												console.log(res);
												
												inspInsertID = res.insertId;
												console.log('This is insertID for a:' +inspInsertID);
												//var inspTypeIndex = res[0].ProdLine;
												console.log('INSERT Successful!');
												//Product function goes in here
											});
									}
								}
								
								if (res.length == 0) { //if product line does not exist, insert ProductLine, then insert inspections
									//Updating ProductLine
									console.log('Updating product line...');
									//var sqlProdLine = "INSERT INTO ProductLine(`CompanyID`, `ProductCatID`, `ProductLineName`) VALUES (?,?,?)";
									//var sqlProdLine = "INSERT INTO ProductLine(`ProductLineID`, `ProductLineName`, CompanyID, ProductCatID) VALUES (?,?,?,?)";
									var sqlProdLine = "INSERT INTO ProductLine(`ProductLineName`, CompanyID, ProductCatID) VALUES (?,?,?)";
									con.query(sqlProdLine, [PLVar,CompIndex, prodCatIndex], function (err, res){
										if (err) throw err;
										console.log(res);
										console.log('New Product Line inserted');
										var prodLineIndex = res.insertId;
										console.log('This is Product Line insertId: '+prodLineIndex);
										
										//Now inserting Inspection, as it depends on this new prodLineIndex
										var sqlInsp = "INSERT INTO Inspection(`InspDate`, `InspTypeID`, `InspectorID`, `ProductLineID`, `ProductCatID`, `CompanyID`) VALUES (NOW(),?,?,?,?,?)";
										con.query(sqlInsp, [inspTypeIndex,inspectorIndex, prodLineIndex, prodCatIndex,CompIndex], function (err, res){
											if (err) throw err;
											console.log(res);
											inspInsertID = res.insertId;
											console.log('Inspection InsertId: '+inspInsertID);
											//Product Function goes in here
										});
										
									});	
									
								}
					
								//Product
								//updating product
								console.log('Getting into product');
								//console.log('CHECKING InsptYPE1:' + $inspTypeIndex);
								//req.body.regPLL.
								var a;
								for (a = 0; a< req.body.regPLL[c].PL.Pr.length; a++) {
									//echo 'CHECKING InsptYPE2:'.$inspTypeIndex;
									console.log('Product Iteration: ' + a);
									console.log('Line Iteration: '+ c);
									console.log('NUMBER OF PRODUCTS: ' +req.body.regPLL[c].PL.Pr.length);
								var prodNameVar =req.body.regPLL[c].PL.Pr[a].ProductName;
								console.log('PRODICT NAME: ' + prodNameVar);
								var prodStrengthVar = req.body.regPLL[c].PL.Pr[a].ProductStrength;
								var NRNVar = req.body.regPLL[c].PL.Pr[a].NRN;
								var SCVar = req.body.regPLL[c].PL.Pr[a].SubClass;
								var GenVar = req.body.regPLL[c].PL.Pr[a].Generic;
								var prodKey = req.body.regPLL[c].PL.Pr[a].ProductKey;
								
								console.log('SUBCLASS: '+SCVar);
								console.log('ProductStrength: ' + prodStrengthVar);
								console.log('NRN: '+ NRNVar);
								
									(function (SCVar, GenVar, prodNameVar, prodLineIndex, dosFormIndex, a) {
									var sqlSC = "SELECT * FROM SubClass WHERE SubClassName = ?";
									con.query(sqlSC, [SCVar], function (err, res){
										if (err) throw err;
										console.log('!!!!!!!!!!');
										console.log(res);
										console.log('!!!!!!!!!!');
										console.log(res[0].SubClassId);
										var subClassIndex = res[0].SubClassId;
										var sqlGen = "SELECT * FROM Generic WHERE GenName = ?";
											con.query(sqlGen, [GenVar], function (err, res){
												if (err) throw err;
												console.log('--------');
												console.log(res);
												console.log('--------');
												var genIndex = res[0].GenId;
												
												//Checking for Product
												
												var sqlProductCheck = "SELECT `ProductID` FROM Product4 WHERE ProductName = ? AND ProductLineID=?";
												(function(sqlProductCheck){
												con.query(sqlProductCheck, [prodNameVar,prodLineIndex], function (err, res){
													console.log('++++++');
													console.log(res);
													
													console.log('++++++');
													if (res[0]) {
														console.log('Product Exists');
														var productExistsIndex = res[0].productID;
														console.log('This is productExistsIndex: '+productExistsIndex);
													}
													
													
													switch (inspTypeIndex) {
														case 8:
															console.log('RENEWAL! '+ inspTypeIndex);
															//Insert operation where primary key = ''
															console.log('A Renewal operation');
															var sqlProd = "UPDATE Product4 SET `NRN`= "+NRNVar +" WHERE Product4.ProductID = " + prodIndex;
															
															break;
															
														default:
															console.log('Most likely Production Inspection');
															//var sqlProd = "INSERT INTO Product4 (`ProductLineID`,`CompID`, `ProductName`, `ProductStrength`, `ProductDF`, `ProductSubClass`, `ProductGen`, `NRN`) VALUES ($prodLineIndex, $companyIndx, "+ prodNameVar + ","+ prodStrengthVar + "," + dosFormIndex + "," + subClassIndex + "," + genIndex + "," + NRNVar + ")";
															var sqlProd = "INSERT INTO Product4 (`ProductID`, `CompID`, `ProductLineID`, `ProductName`, `ProductDF`, `ProductStrength`, `ProductSubClass`, `ProductGen`, `NRN`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)";
															
															
															console.log( 'NORENEWALL'+ inspTypeIndex);
															console.log('Dosage Index:'+ dosFormIndex);
															console.log ('SubClass Index:'+ subClassIndex);
															console.log('Generic Index:'+ genIndex);
															console.log ('ProductLineID: '+ prodLineIndex);
															console.log('ProductName: '+ prodNameVar);
															break;
													}
													
													if (!res[0]) { //Production inspection case. (Work on this?)
														console.log('Case 1');
														console.log('No Product Occurence');
														console.log('ProdLineIndex is: ' +prodLineIndex);
														
														con.query(sqlProd, [CompIndex, prodLineIndex, prodNameVar, dosFormIndex, prodStrengthVar, subClassIndex, genIndex, NRNVar], function (err, res){ //INSERT operation
																if (err)throw err;
																console.log('1 break2 occurence '+ inspTypeIndex);
																console.log(res);
																var prodIndex = res.insertId;
																console.log('Product Index: '+prodIndex);
																(function (c,a) {
																FindingsUpdate(req.body.regPLL[c].PL.Pr[a], prodIndex,prodLineIndex,CompIndex, inspInsertID);
																})(c,a);
																/*
																for (var d = 0;d< req.body.regPLL[c].PL.Pr[a].Finds.length;d++) {
																		console.log('One finding...!');
																		
																		var findDetsVar = req.body.regPLL[c].PL.Pr[a].Finds[d].FindDetail;
																		console.log(findDetsVar);
																		console.log('category...');
																		var findCat = req.body.regPLL[c].PL.Pr[a].Finds[d].radio;
																		var findObs = req.body.regPLL[c].PL.Pr[a].Finds[d].observation;
																		var findsKey =req.body.regPLL[c].PL.Pr[a].Finds[d].key;
																		//var findImgVar = req.files.regPLL[c].PL.Pr[a].Finds[d].name;
																		var findImgVar = null;
																		console.log(findCat);
																		console.log(findObs);
																		//console.log(findImgVar);
																		console.log(findsKey);  //ok for this to be undefined for fresh entry, but should have a value for update operation
																		
																		
																		if (findsKey) { //determining whether we are updating with GMPFinds or Fresh findings.  Fresh findings have no $findsKey
																			//echo 'GMP REASSESMENT!'.$inspTypeIndex;
																			//Insert operation where primary key = ''
																			var sqlFind; 
																			if (findImgVar) { //picture attached to GMP
																				sqlFind = "UPDATE Findings4 SET `FindingImg2` = 'findImgVar', `FindCat`='findCat', `FindObservation` ='findObs' WHERE FindingID = findsKey";
																				console.log('With Image');
																			} else {
																				sqlFind = "UPDATE Findings4 SET `FindCat`='findCat', `FindObservation` ='findObs' WHERE FindingID = findsKey";
																				console.log('Without image');
																			}	
																		} else {
																			sqlFind = "INSERT INTO Findings4 (`ProductID`,`ProductLineID`, `CompID`,`InspID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
																				//var arrValues = [prodIndex, prodLineIndex, CompIndex, inspInsertID ,findImgVar, findDetsVar, findCat, findObs];
																				console.log( 'NOGMP' + inspTypeIndex +' OR Nothing?');
																				console.log('Fresh insert');
																				console.log(prodIndex);
																				console.log(prodLineIndex);
																				console.log(CompIndex);
																				console.log(inspInsertID);
																				console.log(findDetsVar);
																				console.log(findCat);
																				console.log(findObs);
																		}
																		//(function (sqlFind, prodIndex, prodLineIndex, CompIndex, inspInsertID ,findImgVar, findDetsVar, findCat, findObs ) {
																			con.query(sqlFind, [prodIndex, prodLineIndex, CompIndex, inspInsertID ,findImgVar, findDetsVar, findCat, findObs], function (err, res){
																				console.log('Inserting findings...');
																				if (err) throw err;
																				console.log(res);
																			});
																		//})(sqlFind, prodIndex, prodLineIndex, CompIndex, inspInsertID ,findImgVar, findDetsVar, findCat, findObs);
															
															}
															*/
																
														});
													} else if (res[0] && inspTypeIndex== 8) {
															console.log('Case 2');
															con.query(sqlProd, function (err, res){ //UPDATE Operation
																console.log('1 occurence '+ inspTypeIndex + 'AND ' +res[0]);
																console.log(res);
																(function (c,a) { //I think this function is ok here, as in Production inspection case above
																FindingsUpdate(req.body.regPLL[c].PL.Pr[a], prodIndex,prodLineIndex,CompIndex, inspInsertID);
																})(c,a);
															});
														
													} else { //update findings all the same
																console.log('Case 3');
																//sqlProd is Default SQL in Switch Statement
																//con.query(sqlProd, [CompIndex, prodLineIndex, prodNameVar, dosFormIndex, prodStrengthVar, subClassIndex, genIndex, NRNVar], function (err, res){ //INSERT operation
																(function (c,a, productExistsIndex) { //I think this function is ok here, as in Production inspection case above
																FindingsUpdate(req.body.regPLL[c].PL.Pr[a], productExistsIndex,prodLineIndex,CompIndex, inspInsertID);
																})(c,a, productExistsIndex);
																//});
													}
													/*
													console.log('This is a: '+ a);
													console.log('This is c: '+ c);
													//console.log('This is req.body.regPLL[c].PL.Pr[a].Finds.length: '+req.body.regPLL[c].PL.Pr[a].Finds.length);
													/
													
													for (var d = 0;d< req.body.regPLL[c].PL.Pr[a].Finds.length;d++) {
														console.log('One finding...!');
															
															var findDetsVar = req.body.regPLL[c].PL.Pr[a].Finds[d].FindDetail;
															console.log(findDetsVar);
															console.log('category...');
															var findCat = req.body.regPLL[c].PL.Pr[a].Finds[d].radio;
															var findObs = req.body.regPLL[c].PL.Pr[a].Finds[d].observation;
															var findsKey =req.body.regPLL[c].PL.Pr[a].Finds[d].key;
															//var findImgVar = req.files.regPLL[c].PL.Pr[a].Finds[d].name;
															console.log(findCat);
															console.log(findObs);
															//console.log(findImgVar);
															console.log(findsKey);  //ok for this to be undefined for fresh entry, but should have a value for update operation
															
															
															if (findsKey) { //determining whether we are updating with GMPFinds or Fresh findings.  Fresh findings have no $findsKey
																//echo 'GMP REASSESMENT!'.$inspTypeIndex;
																//Insert operation where primary key = ''
																if (findImgVar) { //picture attached to GMP
																	sqlFind = "UPDATE Findings4 SET `FindingImg2` = 'findImgVar', `FindCat`='findCat', `FindObservation` ='findObs' WHERE FindingID = findsKey";
																	console.log('With Image');
																} else {
																	sqlFind = "UPDATE Findings4 SET `FindCat`='findCat', `FindObservation` ='findObs' WHERE FindingID = findsKey";
																	console.log('Without image');
																}	
															} else {
																sqlFind = "INSERT INTO Findings4 (`ProductID`,`ProductLineID`, `CompID`,`InspID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES (prodIndex, prodLineIndex, companyIndex, inspIndex ,'findImgVar', 'findDetsVar', 'findCat', 'findObs')";
																	console.log( 'NOGMP' + inspTypeIndex +' OR Nothing?');
																	console.log('Fresh insert');
															}
															con.query(sqlFind, function (err, res){
																if (err) throw err;
																console.log(res);
															});
															
															
															$findImgType = $_FILES ['regPLL']['type'][$c][PL][Pr][$a][Finds][$b]['FindImg'];//$pLine[PL][Pr][$a][Finds][$b][FindImg][type];
															$findImgError = $_FILES ['regPLL']['error'][$c][PL][Pr][$a][Finds][$b]['FindImg'];//$pLine[PL][Pr][$a][Finds][$b][FindImg][error];
															$findImgTmp = $_FILES ['regPLL']['tmp_name'][$c][PL][Pr][$a][Finds][$b]['FindImg'];
															
															
															echo 'CHECKING InsptYPE3:'.$inspTypeIndex;
															
															echo "Key: ".$findsKey;
															echo "Obs".$findObs;
															
														
															
															if ($findsKey) { //determining whether we are updating with GMPFinds or Fresh findings.  Fresh findings have no $findsKey
																//echo 'GMP REASSESMENT!'.$inspTypeIndex;
																//Insert operation where primary key = ''
																if ($findImgVar) { //picture attached to GMP
																	$sqlFind = "UPDATE Findings4 SET `FindingImg2` = '$findImgVar', `FindCat`='$findCat', `FindObservation` ='$findObs' WHERE FindingID = $findsKey";
																} else {
																	$sqlFind = "UPDATE Findings4 SET `FindCat`='$findCat', `FindObservation` ='$findObs' WHERE FindingID = $findsKey";
																}	
															} else {
																$sqlFind = "INSERT INTO Findings4 (`ProductID`,`ProductLineID`, `CompID`,`InspID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES ($prodIndex, $prodLineIndex, $companyIndex, $inspIndex ,'$findImgVar', '$findDetsVar', '$findCat', '$findObs')";
																	echo 'NOGMP'.$InspTypeIndex.'OR Nothing?';
															}
															
															echo 'LINE:'. $c.' PRODUCT: '.$a.' FINDS: '.$b. '<br/>';
														
															
															echo 'This is radio: '.$findCat;
															if (($findImgType =='image/gif')||($findImgType =='image/jpeg')||($findImgType =='image/pjpeg')||($findImgType =='image/png')) {
																echo 'Passed image type';
																echo 'Error Message: '.$_FILES ['regPLL']['error'][$c][PL][Pr][$a][Finds][$b]['FindImg'];
																if ($findImgError==0){
																	$target = IMGPATH."$regPlace2/$regNoC2/".date('Y-m-d')."/";
																	$target2 = IMGPATH.date('Y-m-d')."/$regPlace2/".$findImgVar;
																	$target3 = IMGPATH.$findImgVar;
																	if (file_exists($target)) {
																		//do nothing;
																		echo 'File exists';
																	} else {
																		mkdir($target, 0777, true);
																		echo 'Directory Created';
																		echo 'This is directory: '.$target;
																	}
																	echo '<br/>'.'This is target: '.$target;
																	if (move_uploaded_file($_FILES ['regPLL']['tmp_name'][$c][PL][Pr][$a][Finds][$b]['FindImg'], $target.$findImgVar)) {
																	echo 'File saved at here: '.$target;
																	//$sqlFind = "INSERT INTO Findings3 (`ProductID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES ($prodIndex, '$findImgVar', '$findDetsVar', '$findCat', '$findObs')";
																	$resultFind = mysqli_query($dbConn,$sqlFind);
																		if (!$resultFind) {
																			die('Invalid Finds. Error '.mysqli_error($dbConn));
																		}
																	} else{
																		echo 'File move unsuccessful';
																	}
																}
															} else{
																	$findImgVar = 'null.jpg';
																	echo 'Not File format: '.$findImgVar;
																	if ($findsKey) { //determining whether we are updating with GMPFinds or Fresh findings.  Fresh findings have no $findsKey
																		$sqlFind = "UPDATE Findings4 SET `FindCat`='$findCat', `FindObservation` ='$findObs' WHERE FindingID = $findsKey";
																	} else {
																		$sqlFind = "INSERT INTO Findings4 (`ProductID`,`ProductLineID`, `CompID`,`InspID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES ($prodIndex, $prodLineIndex, $companyIndex, $inspIndex ,'$findImgVar', '$findDetsVar', '$findCat', '$findObs')";
																	}
																	//$sqlFind = "INSERT INTO Findings4 (`ProductID`,`FindingImg`, `FindingDets`, `FindCat`) VALUES ($prodIndex, '$findImgVar', '$findDetsVar')";
																	$resultFind = mysqli_query($dbConn,$sqlFind);
																	if (!$resultFind) {
																		die('Invalid Finds. Error '.mysqli_error($dbConn));
																	}
																
															}
								
														@unlink($pLine[PL][Pr][$a][Finds][$b][FindImg][tmp_name]);
														
													}//findings
													*/
												});
												})(sqlProductCheck);
												
											});
									});
									})(SCVar, GenVar, prodNameVar, prodLineIndex, dosFormIndex, a);
								
								//SCVar
								
								
								
								
								//Checking for Product
								/*
								$sqlProductCheck = "SELECT `ProductID` FROM Product4 WHERE ProductName = '$prodNameVar' AND ProductLineID=$prodLineIndex";
								//$sqlCompanyAddress3Check = "SELECT `CompanyAddID` FROM CompanyAddress3 WHERE Latitude = $regLat And Longitue = $regLong";
								$resultProductCheck = mysqli_query($dbConn, $sqlProductCheck);	
								while ($row = @mysqli_fetch_assoc($resultProductCheck)){
									echo 'Found productIndex'.$row['ProductID'];
									$prodIndex = $row['ProductID'];
								}
								
								
									switch ($inspTypeIndex) {
										case 8:
											console.log('RENEWAL! '+$inspTypeIndex);
											//Insert operation where primary key = ''
											$sqlProd = "UPDATE Product4 SET `NRN`= "+NRNVar +" WHERE Product4.ProductID = " + prodIndex;
											break;
											
										default:
											$sqlProd = "INSERT INTO Product4 (`ProductLineID`,`CompID`, `ProductName`, `ProductStrength`, `ProductDF`, `ProductSubClass`, `ProductGen`, `NRN`) VALUES ($prodLineIndex, $companyIndex, "+ $prodNameVar + ","+ $prodStrengthVar + "," + $dosFormsIndex + "," + $subClassIndex + "," + $genIndex + "," + $NRNVar + ")";
											
											console.log( 'NORENEWALL'+$InspTypeIndex);
											console.log('InspectionIndex is: '+$inspIndex);
											console.log('Dosage Index:'+$dosFormsIndex);
											console.log ('SubClass Index:'+$subClassIndex);
											console.log('Generic Index:'+$genIndex);
											console.log ('ProductLineID: '+$prodLineIndex);
											console.log('ProductName: '+$prodNameVar);
											break;
									}
								
								
								
								if (mysqli_num_rows($resultProductCheck)==0) {
									echo 'No Product Occurence';
									echo 'ProdLineIndex is: '. $prodLineIndex;
									$resultProd = mysqli_query($dbConn,$sqlProd);
									if (!$resultProd) {
										die('Invalid Products '.'Thhis is dosage: '.$row['DosFormsID'].' And error'.mysqli_error($dbConn));
									} else {
										echo 'UpdatedRenStuff: '.$inspTypeIndex;
									}
									$prodIndex = mysqli_insert_id($dbConn);
								} else if (mysqli_num_rows($resultProductCheck)==1 && $inspTypeIndex== 8) {
									$resultProd = mysqli_query($dbConn,$sqlProd);
									if (!$resultProd) {
										die('Invalid Products '.'Thhis is dosage: '.$row['DosFormsID'].' And error'.mysqli_error($dbConn));
									} else {
										echo 'UpdatedRenStuff: '.$inspTypeIndex;
									}
									echo '1 occurence '+$inspTypeIndex . 'AND'.mysqli_num_rows($resultProductCheck);
									
									
								}
								
										if (count($_POST['regPLL'][$c][PL][Pr][$a][Finds])) {
												for ($b = 0;$b<count($_POST['regPLL'][$c][PL][Pr][$a][Finds]);$b++) {	
													$findDetsVar = $_POST['regPLL'][$c][PL][Pr][$a][Finds][$b][FindDetail];
													$findImgVar = $_FILES ['regPLL']['name'][$c][PL][Pr][$a][Finds][$b]['FindImg'];
													$findImgType = $_FILES ['regPLL']['type'][$c][PL][Pr][$a][Finds][$b]['FindImg'];//$pLine[PL][Pr][$a][Finds][$b][FindImg][type];
													$findImgError = $_FILES ['regPLL']['error'][$c][PL][Pr][$a][Finds][$b]['FindImg'];//$pLine[PL][Pr][$a][Finds][$b][FindImg][error];
													$findImgTmp = $_FILES ['regPLL']['tmp_name'][$c][PL][Pr][$a][Finds][$b]['FindImg'];
													$findCat = $_POST['regPLL'][$c][PL][Pr][$a][Finds][$b][radio];
													$findObs = $_POST['regPLL'][$c][PL][Pr][$a][Finds][$b][observation];
													$findsKey = $_POST['regPLL'][$c][PL][Pr][$a][Finds][$b][key];
													
													echo 'CHECKING InsptYPE3:'.$inspTypeIndex;
													
													echo "Key: ".$findsKey;
													echo "Obs".$findObs;
													
												
													
													if ($findsKey) { //determining whether we are updating with GMPFinds or Fresh findings.  Fresh findings have no $findsKey
														//echo 'GMP REASSESMENT!'.$inspTypeIndex;
														//Insert operation where primary key = ''
														if ($findImgVar) { //picture attached to GMP
															$sqlFind = "UPDATE Findings4 SET `FindingImg2` = '$findImgVar', `FindCat`='$findCat', `FindObservation` ='$findObs' WHERE FindingID = $findsKey";
														} else {
															$sqlFind = "UPDATE Findings4 SET `FindCat`='$findCat', `FindObservation` ='$findObs' WHERE FindingID = $findsKey";
														}	
													} else {
														$sqlFind = "INSERT INTO Findings4 (`ProductID`,`ProductLineID`, `CompID`,`InspID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES ($prodIndex, $prodLineIndex, $companyIndex, $inspIndex ,'$findImgVar', '$findDetsVar', '$findCat', '$findObs')";
															echo 'NOGMP'.$InspTypeIndex.'OR Nothing?';
													}
													
													echo 'LINE:'. $c.' PRODUCT: '.$a.' FINDS: '.$b. '<br/>';
												
													
													echo 'This is radio: '.$findCat;
													if (($findImgType =='image/gif')||($findImgType =='image/jpeg')||($findImgType =='image/pjpeg')||($findImgType =='image/png')) {
														echo 'Passed image type';
														echo 'Error Message: '.$_FILES ['regPLL']['error'][$c][PL][Pr][$a][Finds][$b]['FindImg'];
														if ($findImgError==0){
															$target = IMGPATH."$regPlace2/$regNoC2/".date('Y-m-d')."/";
															$target2 = IMGPATH.date('Y-m-d')."/$regPlace2/".$findImgVar;
															$target3 = IMGPATH.$findImgVar;
															if (file_exists($target)) {
																//do nothing;
																echo 'File exists';
															} else {
																mkdir($target, 0777, true);
																echo 'Directory Created';
																echo 'This is directory: '.$target;
															}
															echo '<br/>'.'This is target: '.$target;
															if (move_uploaded_file($_FILES ['regPLL']['tmp_name'][$c][PL][Pr][$a][Finds][$b]['FindImg'], $target.$findImgVar)) {
															echo 'File saved at here: '.$target;
															//$sqlFind = "INSERT INTO Findings3 (`ProductID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES ($prodIndex, '$findImgVar', '$findDetsVar', '$findCat', '$findObs')";
															$resultFind = mysqli_query($dbConn,$sqlFind);
																if (!$resultFind) {
																	die('Invalid Finds. Error '.mysqli_error($dbConn));
																}
															} else{
																echo 'File move unsuccessful';
															}
														}
													} else{
															$findImgVar = 'null.jpg';
															echo 'Not File format: '.$findImgVar;
															if ($findsKey) { //determining whether we are updating with GMPFinds or Fresh findings.  Fresh findings have no $findsKey
																$sqlFind = "UPDATE Findings4 SET `FindCat`='$findCat', `FindObservation` ='$findObs' WHERE FindingID = $findsKey";
															} else {
																$sqlFind = "INSERT INTO Findings4 (`ProductID`,`ProductLineID`, `CompID`,`InspID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES ($prodIndex, $prodLineIndex, $companyIndex, $inspIndex ,'$findImgVar', '$findDetsVar', '$findCat', '$findObs')";
															}
															//$sqlFind = "INSERT INTO Findings4 (`ProductID`,`FindingImg`, `FindingDets`, `FindCat`) VALUES ($prodIndex, '$findImgVar', '$findDetsVar')";
															$resultFind = mysqli_query($dbConn,$sqlFind);
															if (!$resultFind) {
																die('Invalid Finds. Error '.mysqli_error($dbConn));
															}
														
													}
						
						@unlink($pLine[PL][Pr][$a][Finds][$b][FindImg][tmp_name]);
						}//Findings
						} else {
							echo 'ProdID:'.$prodIndex;
							echo 'InspID:'.$inspIndex;
							$findImgVar="1.jpg";
							$findDetsVar ="Satisfactory";
							$findCat = "Satisfactory";
							$findObs = "Other";
							
							$sqlFind = "INSERT INTO Findings4 (`ProductID`,`ProductLineID`, `CompID`,`InspID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES ($prodIndex, $prodLineIndex, $companyIndex, $inspIndex ,'$findImgVar', '$findDetsVar', '$findCat', '$findObs')";
							echo 'No Findings uploaded';
							
							if ($findImgError==0){
															$target = IMGPATH."$regPlace2/$regNoC2/".date('Y-m-d')."/";
															//$target2 = IMGPATH.date('Y-m-d')."/$regPlace2/".$findImgVar;
															//$target3 = IMGPATH.$findImgVar;
															if (file_exists($target)) {
																//do nothing;
																echo 'File exists';
															} else {
																mkdir($target, 0777, true);
																echo 'Directory Created';
																echo 'This is directory: '.$target;
															}
															echo '<br/>'.'This is target: '.$target;
															echo 'File saved at here: '.$target;
															//$sqlFind = "INSERT INTO Findings3 (`ProductID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES ($prodIndex, '$findImgVar', '$findDetsVar', '$findCat', '$findObs')";
															$resultFind = mysqli_query($dbConn,$sqlFind);
																if (!$resultFind) {
																	die('Invalid Finds. Error '.mysqli_error($dbConn));
																}
															
														}
						}
						$to = $superEmail2;
						$sub =  date("d-M-Y H:i:s").": Inspections conducted at company $regNoC2";
						$msg = "A $regSelInspType2 inspection has been carried out by $regTL2 in $regPlace2 State";
						
						mail($to,$sub,$msg);
						echo $regPlace2." ".$regTL2."MAIL: ".$superEmail2;
						*/
						} // for Product
								
								
							});
							
						}); //product line
					});
					//})(DFVar, c);
			});
			})(c, sqlProdCat);
			console.log('End of For');
		}
	}
});

function FindingsUpdate(Product, prodIndex,prodLineIndex,CompIndex, inspInsertID, findDetsVar, findCat, findObs) {
									console.log(Product);
									if (Product.Finds) { //if not undefined
									for (var d = 0;d< Product.Finds.length;d++) {
																		console.log('One finding...!');
																		
																		var findDetsVar = Product.Finds[d].FindDetail;
																		console.log(findDetsVar);
																		console.log('category...');
																		var findCat = Product.Finds[d].radio;
																		var findObs = Product.Finds[d].observation;
																		var findsKey =Product.Finds[d].key;
																		//var findImgVar = req.files.regPLL[c].PL.Pr[a].Finds[d].name;
																		var findImgVar = null;
																		console.log(findCat);
																		console.log(findObs);
																		//console.log(findImgVar);
																		console.log(findsKey);  //ok for this to be undefined for fresh entry, but should have a value for update operation
																		
																		
																		if (findsKey) { //determining whether we are updating with GMPFinds or Fresh findings.  Fresh findings have no $findsKey
																			//echo 'GMP REASSESMENT!'.$inspTypeIndex;
																			//Insert operation where primary key = ''
																			var sqlFind; 
																			if (findImgVar) { //picture attached to GMP
																				sqlFind = "UPDATE Findings4 SET `FindingImg2` = 'findImgVar', `FindCat`='findCat', `FindObservation` ='findObs' WHERE FindingID = findsKey";
																				console.log('With Image');
																			} else {
																				sqlFind = "UPDATE Findings4 SET `FindCat`='findCat', `FindObservation` ='findObs' WHERE FindingID = findsKey";
																				console.log('Without image');
																			}	
																		} else {
																			sqlFind = "INSERT INTO Findings4 (`ProductID`,`ProductLineID`, `CompID`,`InspID`,`FindingImg`, `FindingDets`, `FindCat`, `FindObservation`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
																				//var arrValues = [prodIndex, prodLineIndex, CompIndex, inspInsertID ,findImgVar, findDetsVar, findCat, findObs];
																				//console.log( 'NOGMP' + inspTypeIndex +' OR Nothing?');
																				console.log('Fresh insert');
																				console.log(prodIndex);
																				console.log(prodLineIndex);
																				console.log(CompIndex);
																				console.log(inspInsertID);
																				console.log(findDetsVar);
																				console.log(findCat);
																				console.log(findObs);
																		}
																		//(function (sqlFind, prodIndex, prodLineIndex, CompIndex, inspInsertID ,findImgVar, findDetsVar, findCat, findObs ) {
																			con.query(sqlFind, [prodIndex, prodLineIndex, CompIndex, inspInsertID ,findImgVar, findDetsVar, findCat, findObs], function (err, res){
																				console.log('Inserting findings...');
																				if (err) throw err;
																				console.log(res);
																			});
																		//})(sqlFind, prodIndex, prodLineIndex, CompIndex, inspInsertID ,findImgVar, findDetsVar, findCat, findObs);
															
															}
														} // If 'Finds'
}

module.exports = router;