
export interface Idea {
  name: string;
  description: string;
}

export interface MatrixRow {
  strategy: 'Unbundling' | 'Decoupling' | 'Servitization';
  survival: Idea;
  entrepreneur: Idea;
  expert: Idea;
}

export interface LogicBreakdown {
  unbundling: {
    dimension: string;
    steps: string;
    discarded: string;
  };
  decoupling: {
    cvc: string;
    painPoint: string;
    discarded: string;
  };
  servitization: {
    product: string;
    state: string;
    transformation: string;
  };
}

export interface AnalysisResult {
  matrix: MatrixRow[];
  logicBreakdown: LogicBreakdown;
}
