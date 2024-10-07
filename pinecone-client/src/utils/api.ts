import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

async function apiGetCall(route: string) {
    const res = await axios.get(`${BASE_URL}/api/${route}`, {
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': "*"
        }
    });
    return res.data;
}


async function apiPostCall<T>(route: string, data: T) {
    const res = await axios.post(`${BASE_URL}/api/${route}`, data, {
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': "*"
        }
    });
    return res.data;
}

async function apiPutCall<T>(route: string, data: T) {
    const res = await axios.put(`${BASE_URL}/api/${route}`, data, {
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': "*"
        }
    });
    return res.data;
}

async function apiDeleteCall<T>(route: string, data: T) {
    const res = await axios.delete(`${BASE_URL}/api/${route}`, {
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': "*"
        },
        data: data
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
    title: string
    parentNodeId?: string
}

export interface MoveNodeReq {
    parentNodeId: string
}

export interface ChangeNodeOrderReq {
    ordering: number
}

export const getNodes = () => apiGetCall("nodes")
export const getNodeById = (id: string) => { apiGetCall(`nodes/${id}`) }
export const insertNode = (req: NodeInsertReq) => apiPostCall<NodeInsertReq>("nodes", req)
export const updateNode = (req: NodeUpdateReq) => apiPutCall<NodeUpdateReq>("nodes", req)
export const moveNode = (req: MoveNodeReq) => apiPutCall<MoveNodeReq>("nodes", req)
export const changeNodeOrder = (req: ChangeNodeOrderReq) => apiPutCall<ChangeNodeOrderReq>("nodes", req)
export const deleteNode = (id: string) => { apiDeleteCall(`nodes/${id}`, {}) }