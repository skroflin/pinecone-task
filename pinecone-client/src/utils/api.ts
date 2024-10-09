import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

async function apiGetCall(route: string) {
    const res = await axios.get(`${BASE_URL}/api/${route}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res.data;
}


async function apiPostCall<T>(route: string, data: T) {
    const res = await axios.post(`${BASE_URL}/api/${route}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res.data;
}

async function apiPutCall<T>(route: string, data: T) {
    const res = await axios.put(`${BASE_URL}/api/${route}`, data, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: data,
        withCredentials: true
    });
    return res.data;
}

async function apiDeleteCall(route: string) {
    const res = await axios.delete(`${BASE_URL}/api/${route}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    return res.data;
}

export interface GetNodeByIdReq {
    id: string
}

export interface NodeInsertReq {
    title: string,
    parentNodeId: string,
    ordering: number
}

export interface NodeUpdateReq {
    id: string
    title: string
    parentNodeId?: string
}

export interface MoveNodeReq {
    id: string
    parentNodeId: string
}

export interface ChangeNodeOrderReq {
    id: string
    ordering: number
}

export const getNodes = () => apiGetCall("nodes")
export const getNodeById = (id: string) => apiGetCall(`nodes/${id}`);
export const insertNode = (req: NodeInsertReq) => apiPostCall<NodeInsertReq>("nodes", req)
export const updateNode = (req: NodeUpdateReq) => apiPutCall<NodeUpdateReq>(`nodes/${req.id}`, req)
export const moveNode = (req: MoveNodeReq) => apiPutCall(`nodes/${req.id}/move`, { parentNodeId: req.parentNodeId });
export const changeNodeOrder = (req: ChangeNodeOrderReq) => apiPutCall<{ ordering: number }>(`nodes/${req.id}/order`, { ordering: req.ordering });
export const deleteNode = (id: string) => apiDeleteCall(`nodes/${id}`);
