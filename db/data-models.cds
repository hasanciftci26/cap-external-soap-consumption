@cds.persistence.skip
entity BusinessUsers {
    key ID                      : String(12);
        FirstName               : String(128);
        LastName                : String(128);
        PersonFullName          : String(258);
        BusinessPartnerRoleCode : String(6);
        HasUser                 : Boolean;
};
