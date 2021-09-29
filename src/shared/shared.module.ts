import { StateMachineModule } from '@depthlabs/nestjs-state-machine';
import { GraphInterface } from '@depthlabs/nestjs-state-machine/dist/interfaces/graph.interface';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedImage } from './entitities/uploaded-image.entity';
import candidateGraph from './state-machines/candidate.graph';
import companyGraph from './state-machines/company.graph';

// Add new graphs here
const stateMachines: GraphInterface[] = [candidateGraph, companyGraph];

const stateMachineModuleConfig: DynamicModule = StateMachineModule.forRoot(stateMachines);

@Module({
  imports: [TypeOrmModule.forFeature([UploadedImage]), stateMachineModuleConfig],
  exports: [stateMachineModuleConfig],
})
export class SharedModule {}
