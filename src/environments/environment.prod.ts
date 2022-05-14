export const environment = {
  production: true,
  //baseURI: 'https://ibrcollectuatv.ng.sbicdirectory.com:5443/API/api/',
  // baseURIHost: 'ibrcollectuatv.ng.sbicdirectory.com:5443',
  // baseURI: 'https://localhost:5001/api/',
  // baseURIHost: 'localhost:5001',
  baseURI: 'https://pngcarp001v.ng.sbicdirectory.com:5443/api/',
  baseURIHost: 'pngcarp001v.ng.sbicdirectory.com:5443',
  modules: [
  { "name": "Data Update", "url": "QuickService/data-mandate", "link": "data-mandate" }, 
  { "name": "Additional Account Opening", "url": "QuickService/additional-account-opening", "link": "additional-account-opening" }, 
  { "name": "Account Reactivation", "url": "QuickService/account-reactivation", "link": "account-reactivation" }, 
  { "name": "Corporate Account Opening", "url": "QuickService/corporate-account-opening", "link": "corporate-account-opening" }, 
  { "name": "Account Upgrade", "url": "QuickService/account-upgrade", "link": "account-upgrade" }, 
  { "name": "KYC Document Update", "url": "QuickService/kyc-document-update", "link": "kyc-document-update" }, 
  { "name": "Internet Banking Onboarding", "url": "QuickService/internet-banking-onboarding", "link": "internet-banking-onboarding" }, 
  { "name": "Merchant Onboarding", "url": "QuickService/merchant-onboarding", "link": "merchant-onboarding" }, { "name": "Business Banking Amendment", "url": "QuickService/business-banking-amendment", "link": "business-banking-amendment" }, 
  { "name": "Loan Initiation", "url": "QuickService/loan-initiation", "link": "loan-initiation" }, 
  { "name": "SME OnBoarding Request", "url": "QuickService/sme-onboarding-request", "link": "sme-onboarding-request" }, 
  { "name": "Password Reset", "url": "QuickService/password-reset", "link": "password-reset" }, 
  { "name": "Failed Transaction", "url": "QuickService/failed-transaction", "link": "failed-transaction" },
  { "name": "Loan Repayment", "url": "QuickService/loan-repayment", "link": "loan-repayment" },
  { "name": "Debit Card Request", "url": "QuickService/debit-card-request", "link": "debit-card-request" }],
};