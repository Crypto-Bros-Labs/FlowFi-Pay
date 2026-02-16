export interface BankAccounts {
  userBankInformationUuid: string;
  clabe: string;
  bankName: string;
  country: string;
}

export interface BankData {
  userUuid: string;
  clabe: string;
  bankName: string;
  country: string;
}

export interface BankAccountResponse {
  userBankInformationUuid: string;
  clabe: string;
  bankName: string;
  country: string;
}

export interface UsaBankData {
  userUuid: string;
  accountIdentifier: string;
  routingNumber: string;
  bankName: string;
  accountType: string;
  documentIdentifier: string;
  accountHolder: {
    type: string;
    businessName: string;
    firstName: string;
    lastName: string;
  };
  address: {
    country: string;
    state: string;
    city: string;
    streetLine1: string;
    streetLine2: string;
    postalCode: string;
  };
}

export interface UsaBankAccountResponse {
  userUuid: string;
  usBankInfoUuid: string;
  accountType: string;
  documentIdentifier: string;
  accountHolder: {
    type: string;
    businessName: string;
    firstName: string;
    lastName: string;
  };
  address: {
    country: string;
    state: string;
    city: string;
    streetLine1: string;
    streetLine2: string;
    postalCode: string;
  };
  accountIdentifier: string;
  routingNumber: string;
  bankName: string;
}
