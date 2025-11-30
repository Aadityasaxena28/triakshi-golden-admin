import api from "./API";

export async function getBills() {
  const resp = await api("/payment/get-all");
  const payload = resp.data;
  // console.log(payload.bills);
  if(!payload.success) return Promise.reject(payload.error||"Error in geting bills")
  return payload.bills; 
}


export async function updateBillStatusAPI(params: { 
  id: string; 
  transaction?: string; 
  status: string; 
}) {
  const { id, transaction, status } = params;

  try {
    const resp = await api.put(`/payment/update-bill-status/${id}`, {
      transaction,
      status,
    });

    const payload = resp.data;

    if (!payload.success) {
      throw new Error(payload.error || "Failed to update bill status");
    }

    return payload.data; // return updated bill details
  } catch (err: any) {
    console.error("updateBillStatusAPI error:", err);
    throw new Error(err?.message || "Request failed");
  }
}

export async function getBillById(billId:string) {

  const resp = await api.get(`/payment/get-bill-admin/${billId}`);

  const payload = resp.data;

  if (!payload.success) {
    return Promise.reject(payload.error || "Failed to fetch bill");
  }
  // console.log(payload.bill);
  return payload.bill;
}

