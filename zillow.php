<? php
// Set  return content type
require('zillow_api.php');
header('Content-type: application/xml');

$basic_url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=";
$aempZillowKey = "X1-ZWz192sijazq4r_8uv2u";
$address_string = $_POST['address'];

$str_xml = file_get_contents($basic_url . $aempZillowKey . "&address=" . $address_string . "&citystatezip=SanFrancisco%2C+CA');";
$obj_xml = new SimpleXMLElement($str_xml);
print "<b>Address:</b> " . $obj_xml->request->address . "<br/>" . PHP_EOL;

$zillow_api = new Zillow_Api($aempZillowKey);

$search_result = $zillow_api->GetSearchResults(array('address' => $address_string, 'citystatezip' => 'SANFRANCISCO'));

echo $search_result

?>
