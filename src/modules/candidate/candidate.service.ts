import { ConflictException, Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { Role, RoleType } from '../user/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CandidateSkillSet } from './models/candidate-skill-set.entity';
import { Candidate } from './models/candidate.entity';
import { EducationDetail } from './models/education-detail.entity';
import { ExperienceDetail } from './models/experience-detail.entity';

@Injectable()
export class CandidateService {
  async createCandidate(createCandidateDto: CreateCandidateDto) {
    return getManager().transaction(async (manager) => {
      const userFound = await manager.findOne(User, {
        where: { email: createCandidateDto.email },
      });
      if (userFound) {
        throw new ConflictException('USER_ALREADY_EXISTS');
      }
      const role = await manager.findOne(Role, { where: { name: RoleType.CANDIDATE } });
      const newUser = manager.create(User, { email: createCandidateDto.email, role });
      newUser.role = role;
      await manager.save(newUser);
      const candidate = manager.create(Candidate, {
        name: createCandidateDto.name,
        lastname: '',
        user: newUser,
      });
      await manager.save(candidate);

      if (createCandidateDto.skillSets) {
        // insert all skill sets in table
        const skillSets = createCandidateDto.skillSets.map((skill) => ({
          skillSetId: skill,
          candidateId: candidate.id,
          level: 1,
        }));
        await manager
          .createQueryBuilder()
          .insert()
          .into(CandidateSkillSet)
          .values(skillSets)
          .execute();
      }
      if (createCandidateDto.experienceDetails) {
        const experienceDetails = [];
        for (const detail of createCandidateDto.experienceDetails) {
          experienceDetails.push(manager.create(ExperienceDetail, { ...detail }));
        }
        candidate.experienceDetails = experienceDetails;
      }
      if (createCandidateDto.educationDetails) {
        const educationDetails = [];
        for (const detail of createCandidateDto.educationDetails) {
          educationDetails.push(manager.create(EducationDetail, { ...detail }));
        }
        candidate.educationDetails = educationDetails;
      }
      newUser.candidate = candidate;

      return manager.save(newUser);
    });
  }
}
