import { route as routeFn } from 'ziggy-js'; 
import { Ziggy } from '@/ziggy';          

export default function route(name, params = {}, absolute = true) {
  return routeFn(name, params, absolute, Ziggy);
}
