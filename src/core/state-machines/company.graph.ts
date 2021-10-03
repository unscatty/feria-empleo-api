import { GraphInterface } from '@depthlabs/nestjs-state-machine/dist/interfaces/graph.interface';

export enum COMPANY_STATES {
  INVITED = 'INVITED',
  REGISTERED = 'REGISTERED',
  COMPLETED = 'COMPLETED',
}

export enum COMPANY_TRANSITIONS {
  REGISTER = 'REGISTER',
  COMPLETE = 'COMPLETE',
}

export const COMPANY_GRAPH_NAME = 'COMPANY_GRAPH';

const companyGraph: GraphInterface = {
  name: COMPANY_GRAPH_NAME,
  initialState: COMPANY_STATES.INVITED,
  states: Object.values(COMPANY_STATES),
  transitions: [
    {
      name: COMPANY_TRANSITIONS.REGISTER,
      from: [COMPANY_STATES.INVITED],
      to: COMPANY_STATES.REGISTERED,
    },
    {
      name: COMPANY_TRANSITIONS.COMPLETE,
      from: [COMPANY_STATES.REGISTERED],
      to: COMPANY_STATES.COMPLETED,
    },
  ],
};

export default companyGraph;
