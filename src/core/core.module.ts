import { StateMachineModule } from '@depthlabs/nestjs-state-machine';
import { GraphInterface } from '@depthlabs/nestjs-state-machine/dist/interfaces/graph.interface';
import { DynamicModule, Module } from '@nestjs/common';
import candidateGraph from './state-machines/candidate.graph';
import companyGraph from './state-machines/company.graph';
import { StateMachineExceptionInterceptor } from './state-machines/interceptors/state-machine-exception.interceptor';

// Add new graphs here
const stateMachines: GraphInterface[] = [candidateGraph, companyGraph];

const stateMachineModuleConfig: DynamicModule = StateMachineModule.forRoot(stateMachines);
@Module({
  imports: [stateMachineModuleConfig],
  providers: [StateMachineExceptionInterceptor],
  exports: [stateMachineModuleConfig, StateMachineExceptionInterceptor],
})
export class CoreModule {}
