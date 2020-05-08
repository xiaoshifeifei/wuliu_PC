/*
 * @Author: your name
 * @Date: 2020-04-09 15:25:16
 * @LastEditTime: 2020-04-17 17:58:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gswl-web\src\mixins\DisabledAuthFilterMixin.js
 */
/**
 *
 */
import { disabledAuthFilter } from "@/utils/authFilter"

export const DisabledAuthFilterMixin = {
  props: ['formData'],
  data(){
    return {

    }
  },
  methods:{
    isDisabledAuth(code){
      return disabledAuthFilter(code,this.formData);
    },
  }

}