export interface SessionOutput {
  token: string;
  expiresAt: Date;
}

export interface AuthenticateExternalIdentityResponse {
  provider: string;
  subject: string;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  registrationRequired: boolean;
  session: SessionOutput | null;
  registrationTokenId: string | null;
}
