const soap = require("soap");
const client = require("@sap-cloud-sdk/http-client");
const connectivity = require("@sap-cloud-sdk/connectivity");

class SOAPClient {

    async getSoapService(service, wsdl, endpoint) {
        // Get the service reference
        const oSOAPDefinition = cds.env.requires[service],
            // Get the destination data from BTP
            oDestination = await connectivity.getDestination({ destinationName: oSOAPDefinition.credentials.destination }),
            // Get service endpoint
            sURL = oDestination.url;
        let oHTTPClient = {};

        endpoint.url = sURL + oSOAPDefinition.credentials.path;

        // Create an httpClient which connects over the BTP Destination
        oHTTPClient = {
            request: async function (url, data, fnCallback, extraHeaders, extraOptions) {
                client.executeHttpRequest(oDestination, {
                    method: "POST",
                    url: url,
                    data: data,
                    headers: extraHeaders
                }, { ...extraOptions, fetchCsrfToken: false }).then((result) => {
                    fnCallback(null, result, result.data);
                }).catch((e) => {
                    fnCallback(e);
                });
            }
        }

        // Instantiate the service using that http client
        return soap.createClientAsync(wsdl, { httpClient: oHTTPClient });
    }
}

module.exports = SOAPClient;
