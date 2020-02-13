const express = require('express')
const fs = require("fs")
const sslCertificate = require('get-ssl-certificate')
app = express()
app.get("/",(req,res)=>{res.send("yooooo")}) 

sslCertificate.get('nodejs.org').then(function (certificate) {
    console.log(certificate)
    // certificate is a JavaScript object
  
    console.log(certificate.issuer)
    // { C: 'GB',
    //   ST: 'Greater Manchester',
    //   L: 'Salford',
    //   O: 'COMODO CA Limited',
    //   CN: 'COMODO RSA Domain Validation Secure Server CA' }
  
    console.log(certificate.valid_from)
    // 'Aug  14 00:00:00 2017 GMT'
  
    console.log(certificate.valid_to)
    // 'Nov 20 23:59:59 2019 GMT'
  
    // If there was a certificate.raw attribute, then you can access certificate.pemEncoded
    console.log(certificate.pemEncoded)
    // -----BEGIN CERTIFICATE-----
    // ...
    // -----END CERTIFICATE-----
  });
  app.listen(2000,()=>{console.log("connected");})