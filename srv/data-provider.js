const cds = require("@sap/cds"),
    SOAPClient = require("./handlers/soap-client");

module.exports = cds.service.impl(function () {
    this.on("READ", "BusinessUsers", async (req, res) => {
        let oBusinessUserServiceEndpoint = { url: null },
            aResults = [];
        const oSOAPClient = new SOAPClient(),
            oBusinessUserService = await oSOAPClient.getSoapService("BusinessUserService",
                "./srv/external/QUERYBUSINESSUSERIN.wsdl",
                oBusinessUserServiceEndpoint
            ),
            // Set the parameters for the QueryBusinessUserIn method of the sevice 
            oBody = {
                BusinessUser: {
                    PersonIDInterval: {
                        IntervalBoundaryTypeCode: 9,
                        LowerBoundaryPersonID: "0000000000"
                    },
                    BusinessPartnerRoleCodeInterval: {
                        IntervalBoundaryTypeCode: 9,
                        LowerBoundaryBusinessPartnerRoleCode: "000000"
                    }
                },
                QueryProcessingConditions: {
                    QueryHitsUnlimitedIndicator: true
                }
            },
            aBusinessUsers = [];

        try {
            oBusinessUserService.setEndpoint(oBusinessUserServiceEndpoint.url);
            // Invoke QueryBusinessUserIn method asynchronously and wait for the response
            aResults = await oBusinessUserService.QueryBusinessUserInAsync(oBody);

            // Prepare the actual service response
            if (aResults && aResults[0] && aResults[0].BusinessUser) {
                aResults[0].BusinessUser.forEach(busUser => {
                    aBusinessUsers.push({
                        ID: ((busUser.User) ? busUser.User.UserID : busUser.PersonID),
                        FirstName: busUser.PersonalInformation.FirstName,
                        LastName: busUser.PersonalInformation.LastName,
                        PersonFullName: busUser.PersonalInformation.PersonFullName,
                        BusinessPartnerRoleCode: busUser.BusinessPartnerRoleCode,
                        HasUser: ((busUser.User) ? true : false)
                    });
                });
            }

            return aBusinessUsers;
        } catch (err) {
            req.error(err.code, err.message);
        }
    });
});