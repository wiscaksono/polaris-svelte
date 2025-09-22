import { getContext, setContext } from 'svelte';

type Getter<T> = () => T;

export type DashboardStateProps = {
  trxType: Getter<number>;
  setTrxType: (open: number) => void;
};


class DashboardState {
  readonly props: DashboardStateProps;
  trxType = $derived.by(() => this.props.trxType());
  setTrxType: DashboardStateProps['setTrxType'];

  constructor(props: DashboardStateProps) {
    this.setTrxType = props.setTrxType;
    this.props = props;
  }
}

const SYMBOL_KEY = 'dashboard-state';


export function setDashboard(props: DashboardStateProps): DashboardState {
  return setContext(Symbol.for(SYMBOL_KEY), new DashboardState(props));
}

export function useDashboard(): DashboardState {
  return getContext(Symbol.for(SYMBOL_KEY));
}
