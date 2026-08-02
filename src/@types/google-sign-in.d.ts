interface GoogleSignInResponse {
  credential: string;
}

interface GoogleAccountsIdInitializeConfig {
  client_id: string;
  callback: (response: GoogleSignInResponse) => void;
  [key: string]: unknown;
}

interface GoogleAccountsId {
  initialize: (config: GoogleAccountsIdInitializeConfig) => void;
  prompt: () => void;
  [key: string]: unknown;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
  [key: string]: unknown;
}

interface Google {
  accounts: GoogleAccounts;
  [key: string]: unknown;
}

declare global {
  interface Window {
    google?: Google;
  }
}

export {};
