import { getContext, onMount, setContext } from 'svelte';
import type { DataPPdanTURes } from './type';

class DataPPdanTUState {
  data?: DataPPdanTURes;

  constructor(data?: DataPPdanTURes) {
    this.data = data

    onMount(() => {
      console.log('effect', data)
    })
  }
}

const SYMBOL_KEY = 'data-pp-dan-tu';

export function setDataPPdanTU(data?: DataPPdanTURes) {
  setContext(Symbol.for(SYMBOL_KEY), new DataPPdanTUState(data));
}

export function useDataPPdanTU(): DataPPdanTUState {
  return getContext(Symbol.for(SYMBOL_KEY));
}

