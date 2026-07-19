import {Review} from "@/DataType/ReviewDT";
import api from "./API";
import { CornerDownLeft } from "lucide-react";


const BASE_PATH="/reviews";

export async function createReview(params:Review){
    const response=await api.post(`${BASE_PATH}/admin-create`,params);

    const payload=response.data;

    if(!payload.success){
        return Promise.reject(payload.message||"Failed to create review");
    }

    return payload;
}

export async function editReview(params:Review,id:string){
    const response=await api.patch(`${BASE_PATH}/admin-update/${id}`,params);

    const payload=response.data;

    if(!payload.success){
        return Promise.reject(payload.message||"Failed to update the review");
    }

    return payload;
}

export async function deleteReview(id:string){
    const response=await api.delete(`${BASE_PATH}/admin-delete/${id}`);

    const payload=response.data;

    if(!payload.success){
        return Promise.reject(payload.message||`Failed to delete review ${id}`);
    }

    return payload;
}

export async function getReviewsByProduct(product_id:string){
    const query=new URLSearchParams();

    query.append("product_id",product_id);

    const response=await api.get(`${BASE_PATH}?${query.toString()}`);

    const payload=response.data;

    if(!payload.success){
        return Promise.reject(
        payload.message||`Unable to fetch reviews related to product : ${product_id}`
        );
    }
    const data = payload.data.map((item)=>{
        const {customer_name:customerName,...rest} = item;
        const record = {...rest,customerName};
        return record;
    })
    
    console.log(data);
    return data||payload.reviews||[];
}