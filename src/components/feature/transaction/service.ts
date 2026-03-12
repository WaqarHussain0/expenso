interface ICreateOrUpdatePayload {
  categoryId: string;
  amount: number;
  date: Date;
  note?: string;
}

export const createTransactionService = async (
  payload: ICreateOrUpdatePayload,
) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return await fetch(`${baseUrl}/api/transactions`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateTransactionService = async (
  id: string,
  payload: ICreateOrUpdatePayload,
) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return await fetch(`${baseUrl}/api/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const deleteTransactionService = async (id: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return await fetch(`${baseUrl}/api/transactions/${id}`, {
    method: 'DELETE',
  });
};
