import IPToASN from 'ip-to-asn';
 
var client = new IPToASN();
 
var addresses = [
  '169.150.218.19'
];
 
client.query(addresses, function (err, results) {
  if (err) {
    console.error(err);
    return;
  }
 
  console.log(results);
});