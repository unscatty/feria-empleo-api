import { GraphInterface } from '@depthlabs/nestjs-state-machine/dist/interfaces/graph.interface';

export enum CANDIDATE_STATES {
  REGISTERED = 'REGISTERED',
  COMPLETED = 'COMPLETED',
}

export enum CANDIDATE_TRANSITIONS {
  COMPLETE = 'COMPLETE',
}

export const CANDIDATE_GRAPH_NAME = 'CANDIDATE_GRAPH';

const candidateGraph: GraphInterface = {
  name: CANDIDATE_GRAPH_NAME,
  initialState: CANDIDATE_STATES.REGISTERED,
  states: Object.values(CANDIDATE_STATES),
  transitions: [
    {
      name: CANDIDATE_TRANSITIONS.COMPLETE,
      from: [CANDIDATE_STATES.REGISTERED],
      to: CANDIDATE_STATES.COMPLETED,
    },
  ],
};

export default candidateGraph;
