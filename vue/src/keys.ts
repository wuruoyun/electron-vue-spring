import { InjectionKey } from 'vue'
import Interop from './types/InterOp'

export const KEY_INTEROP = Symbol() as InjectionKey<Interop>
export const KEY_LOG = Symbol() as InjectionKey<Interop['log']>
