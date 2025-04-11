import { defineStore } from 'pinia';
import http from './http';
import { Response } from '@/types';
import { useMenuStore } from './menu';
import { useAuthStore } from '@/plugins';
import { useLoadingStore } from './loading';
import { doLogin } from "@/api/basic";
import { message, Modal } from 'ant-design-vue';
export interface Profile {
  account: Account;
  permissions: string[];
  role: string;
}
export interface Account {
  username: string;
  avatar: string;
  gender: number;
}

export type TokenResult = {
  token: string;
  expires: number;
};
export const useAccountStore = defineStore('account', {
  state() {
    return {
      account: {} as Account,
      permissions: [] as string[],
      role: '',
      logged: true,
      fileUrl: 'http://192.168.120.214:4610/file/getFile?path='
    };
  },
  actions: {
    getFileUrl(path: string) {
      return this.fileUrl

    },
    async login(username: string, password: string, code: string, uuidstr: string) {
      console.log(username, password);
      return new Promise((resolve) => {
        let p = {
          account: username,
          password: password,
          uuidStr: uuidstr,
          code: code,
        }
        doLogin(p).then((res: any) => {
          console.log('d', res.data);
          // if (res.data.code === 0) {
          //   localStorage.setItem('userInfo', JSON.stringify(res.data.data));
          //   return res.data;
          // } else {
          //   message.error(res.data.msg);
          //   return res.data;
          // }
          resolve(res.data);
          // return res.data;
        });
      })

    },
    async logout() {
      return new Promise<boolean>((resolve) => {
        localStorage.removeItem('stepin-menu');
        http.removeAuthorization();
        this.logged = false;
        resolve(true);
      });
    },
    async profile() {
      const { setAuthLoading } = useLoadingStore();
      setAuthLoading(true);
      return http
        .request<Account, Response<Profile>>('/account', 'get')
        .then((response) => {
          if (response.code === 0) {
            const { setAuthorities } = useAuthStore();
            const { account, permissions, role } = response.data;
            this.account = account;
            this.permissions = permissions;
            this.role = role;
            setAuthorities(permissions);
            return response.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setAuthLoading(false));
    },
    setLogged(logged: boolean) {
      this.logged = logged;
    },
  },
});
