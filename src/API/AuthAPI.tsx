import api from "./API";
export async function SigInAPI(params:{
  userID:string,
  password:string
}) {
    const resp = await api.post("/auth/admin-signin",params);
    const  payload = resp.data;
    if(!payload.success) return Promise.reject(payload.message);
    return payload;
}


export async function verifyTokenAPI() {
  const resp = await api.get("/auth/admin-verify");
  const payload = resp.data;
  return payload;
}