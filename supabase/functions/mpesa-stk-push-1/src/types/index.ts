export interface StkPushRequest {
  phone: string;
  amount: number;
  accountReference?: string;
}

export interface StkPushResponse {
  success: boolean;
  checkoutRequestID?: string;
  merchantRequestID?: string;
  message?: string;
  error?: string;
  details?: Record<string, unknown>;
}