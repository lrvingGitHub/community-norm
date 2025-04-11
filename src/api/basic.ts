import http from "@/store/http";
export const getCode = (data: any) => {
    return http.request<any>('/login/getToken', 'get', data)
}
export const doLogin = (data: any) => {
    return http.request<any>('/login/doLogin', 'post_json', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const listUser = (data: any) => {
    return http.request<any>('/user/listUser', 'post_json', data)
}
export const listrole = (data: any) => {
    return http.request<any>('/role/list', 'get', data)
}
export const listpower = (data: any) => {
    return http.request<any>('/power/list', 'get', data)
}
export const createUser = (data: any) => {
    return http.request<any>('/user/createUser', 'post_json', data)
}
export const delUser = (data: any) => {
    return http.request<any>('/user/delUser', 'post', data)
}
export const resetPassword = (data: any) => {
    return http.request<any>('/user/resetPassword', 'post', data)
}

export const pointselect = (data: any) => {
    return http.request<any>('/point/select', 'post_json', data)
}
export const getFile = (data: any) => {
    return http.request<any>('/file/getFile', 'get', data)
}

export const inspectorList = (data: any) => {
    return http.request<any>('/inspector/list', 'get', data)
}
export const pointList = (data: any) => {
    return http.request<any>('/point/list', 'get', data)
}
export const uploadStand = (data: any) => {
    return http.request<any>('/file/uploadStand', 'post_json', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const uploadPatrol = (data: any) => {
    return http.request<any>('/file/uploadPatrol', 'post_json', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const pointadd = (data: any) => {
    return http.request<any>('/point/add', 'post_json', data)
}

export const pointupdate = (data: any) => {
    return http.request<any>('/point/update', 'post_json', data)
}
export const pointdel = (data: any) => {
    return http.request<any>('point/del', 'post_json', data)
}
export const patrolselect = (data: any) => {
    return http.request<any>('/patrol/select', 'post_json', data)
}
export const patrolupdate = (data: any) => {
    return http.request<any>('/patrol/update', 'post_json', data)
}
export const patroldel = (data: any) => {
    return http.request<any>('/patrol/del', 'post', data)
}
export const patroladd = (data: any) => {
    return http.request<any>('/patrol/add', 'post_json', data)
}
export const patroldetail = (data: any) => {
    return http.request<any>('/patrol/detail', 'post', data)
}
export const patrolcount = (data: any) => {
    return http.request<any>('/patrol/count', 'post_json', data)
}
export const updatePassword = (data: any) => {
    return http.request<any>('login/updatePassword', 'post_json', data)
}




