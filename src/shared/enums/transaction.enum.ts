export enum TransactionStatusEnum {
  SUCCEEDED = 'Succeeded',
  FAILED = 'Failed'
}


export enum FailedTransactionReasonEnum {
  NULL = null,
  PAYMENT_METHOD_NOT_FOUND = 'Payment method on Stripe not found.',
  PAYMENT_INTENT_CREATION_ERROR = 'Payment intent created unsuccessfully.',
  PAYMENT_INTENT_CONFIRMATION_ERROR = 'Payment intent confirmed unsuccessfully.',
  STRIPE_CUSTOMER_NOT_FOUND = 'Stripe customer against sCustomerId not found.',
}
