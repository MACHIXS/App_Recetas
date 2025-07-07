import client from './client';

export const createPreference = ({ amount, description, payerEmail }) =>
  client.post('/payments/create-preference', {
    amount,
    description,
    payerEmail
  });

