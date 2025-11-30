import api from "./API";

export async function ProductCountAPI() {
  const resp = api.get('/products/count');
  const payload = (await resp).data;

  if(!payload.success) return Promise.reject(payload.error);
  
  return payload.count
}

export async function billStatsAPI() {
  const resp = api.get('/payment/get-bill-stats');
  const payload = (await resp).data;

  if(!payload.success) return Promise.reject(payload.error);
  // console.log(payload.data);
  return payload.data;
}