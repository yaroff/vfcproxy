const http = require('http');
const https = require('https');
var soap = require('soap');
fs = require('fs').promises;

let clientUrl = "https://vfc.corp.rarus-cloud.ru/VFC_TRADE_TEST6/vfc.1cws?wsdl";

let PrintLabel = function (param) {
    return new Promise((resolve, reject) => {
        soap.createClient(clientUrl, (err, client) => {
            client.vfc_webservices.vfc_webservicesSoap.PrintLabel(param, (err, result) => {
                return resolve(result);
            })
        })
    })
};

let ProcessAggregation = function (param) {
    return new Promise((resolve, reject) => {
        soap.createClient(clientUrl, (err, client) => {
            client.vfc_webservices.vfc_webservicesSoap.ProcessAggregation(param, (err, result) => {
                return resolve(result);
            });
        });
    });
};

let TransactInOut = function (param) {
    return new Promise((resolve, reject) => {
        soap.createClient(clientUrl, (err, client) => {
            client.vfc_webservices.vfc_webservicesSoap.TransactInOut(param, (err, result) => {
                return resolve(result);
            })
        })
    })
};


var myService = {
    traceREADYWS: { 
        traceREADYWSSoap: {
            PrintLabel:  async function(args) {
                console.log('PrintLabel service called');

                let params = {
                    BECode: args.BECode,
                    PackType: args.PackType,
                    SKUCode: args.SKUCode,
                    SKUName: args.SKUName,
                    LabelCount: args.LabelCount,
                    ParentID: args.ParentID,
                    PrinterID: args.PrinterID,
                    UserName: args.UserName
                };

                let soapResult = await PrintLabel(params);

                return {
                    PrintLabelResult: {
                        ReturnCode: soapResult.Response.ReturnCode,
                        ReturnValue: soapResult.Response.ReturnValue
                    }
                };
            },

            ProcessAggregation: async function(args) {
                console.log('ProcessAggregation service called');

                let params = {
                    BECode: args.BECode,
                    ParentID: args.ParentID,
                    ProcessType: args.ProcessType,
                    UserName: args.UserName
                }

                let soapResult = await ProcessAggregation(params);

                return {
                    ProcessAggregationResult: {
                        ReturnCode: soapResult.Response.ReturnCode,
                        ReturnValue: soapResult.Response.ReturnValue
                    }
                }
            },

            TransactInOut: async function(args) {
                console.log('ProcessAggregation service called');

                let params = {
                    BECode: args.BECode,
                    EPC: args.EPC,
                    Status: args.Status,
                    SenderCustodianID: args.SenderCustodianID,
                    ReceiverCustodianID: args.ReceiverCustodianID,
                    SenderOwnerID: args.SenderOwnerID,
                    ReceiverOwnerID: args.ReceiverOwnerID,
                    BizTxnType: args.BizTxnType,
                    BizTxnID: args.BizTxnID,
                    ExtAttrList: {
                        cost: args.ExtAttrList.cost,
                        VAT: args.ExtAttrList.VAT
                    },
                    UserName: args.UserName
                }

                let soapResult = await TransactInOut(params);

                return {
                    TransactInOutResponse: {
                        ReturnCode: soapResult.Response.ReturnCode,
                        ReturnValue: soapResult.Response.ReturnValue
                    }
                }
            }
        }
    }
};

async function main() {

    var xml = await fs.readFile('./wsdl/traceREADYWS.wsdl', 'utf8');

    const options = {
        key: await fs.readFile('./certificates/key.pem'),
        cert: await fs.readFile('./certificates/cert.pem')
      };

    const server = http.createServer((request, response) => {
        console.log('Request: ', request);
        response.writeHead(200); //, {"Content-Type": "text/plain"});
        response.end("Hello, World!\n");
    });

    server.listen(8000);

    let soapServer = soap.listen(server, '/wsdl', myService, xml, function(){
        console.log('SOAP server initialized');
    });

    console.log("Server running at http://127.0.0.1:8000/");

}

main();