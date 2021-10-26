import { AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { findIndex, isEmpty, isEqual, isUndefined } from 'lodash';
import { EntityManager, getManager, In, Repository, SelectQueryBuilder } from 'typeorm';
import { SkillSet } from '../skill-set/entities/skill-set.entity';
import { ContactDetail } from '../user/entities/contact-detail.entity';
import { Role, RoleType } from '../user/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { FilterCandidateDto } from './dto/filter-candidate.dto';
import { CandidateSkillSet } from './models/candidate-skill-set.entity';
import { Candidate } from './models/candidate.entity';
import { EducationDetail } from './models/education-detail.entity';
import { ExperienceDetail } from './models/experience-detail.entity';

@Injectable()
export class CandidateService {
  private queryBuilder: () => SelectQueryBuilder<Candidate>;

  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(ContactDetail)
    private contactDetailsRepository: Repository<ContactDetail>,
    private azure: AzureStorageService
  ) {
    this.queryBuilder = () => this.candidateRepository.createQueryBuilder('candidate');
  }

  async createCandidate(createCandidateDto: CreateCandidateDto) {
    return getManager().transaction(async (manager) => {
      const userFound = await manager.findOne(User, {
        where: { email: createCandidateDto.email },
      });
      if (userFound) {
        throw new ConflictException('USER_ALREADY_EXISTS');
      }
      const role = await manager.findOne(Role, { where: { name: RoleType.CANDIDATE } });
      const newUser = manager.create(User, {
        email: createCandidateDto.email,
        name: createCandidateDto.name,
        lastname: '',
        role,
      });
      newUser.role = role;
      await manager.save(newUser);
      const candidate = manager.create(Candidate, {
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

  async getCandidates(user: User) {
    return this.candidateRepository.find({
      where: {
        user: user.id,
      },
      relations: ['experienceDetails', 'educationDetails', 'skillSets'],
    });
  }

  async getCandidateById(candidateFilter: FilterCandidateDto) {
    const candidate: Candidate = await this.candidateRepository.findOne(candidateFilter.id, {
      relations: ['experienceDetails', 'educationDetails', 'skillSets'],
    });
    return candidate;
  }

  async getContactDetails(user: User) {
    return await this.contactDetailsRepository.find({
      where: {
        user: user.id,
      },
    });
  }

  async getCandidateContactDetails(candidateFilter: FilterCandidateDto) {
    console.log(candidateFilter);
    const candidate: Candidate = await this.candidateRepository.findOne(candidateFilter.id);
    const user: User = new User();
    user.id = candidate.user.id;
    return this.getContactDetails(user);
  }

  async updateResume(resume: UploadedFileMetadata, candidate: Candidate, manager: EntityManager) {
    if (resume) {
      const url = await this.azure.upload(resume);
      await manager.update(Candidate, { id: candidate.id }, { resume: url });
    }
  }

  async updateCandidate(
    updateCandidateDto: CreateCandidateDto,
    manager: EntityManager,
    candidate: Candidate
  ) {
    await this.updateContactDetails(updateCandidateDto, manager, candidate);
    await this.updateSkillSets(updateCandidateDto, candidate, manager);
    await this.updateExperienceDetails(
      updateCandidateDto.experienceDetails as ExperienceDetail[],
      candidate,
      manager
    );
  }

  private async updateExperienceDetails(
    experienceDetails: ExperienceDetail[],
    candidate: Candidate,
    manager: EntityManager
  ) {
    const newExperiences = [];
    for (const experience of experienceDetails) {
      if (isUndefined(experience.id)) {
        newExperiences.push(experience);
      } else {
        await manager.update(
          ExperienceDetail,
          { id: experience.id },
          {
            startDate: experience.startDate,
            endDate: experience.endDate,
            jobTitle: experience.jobTitle,
            jobDescription: experience.jobDescription,
            companyName: experience.companyName,
          }
        );
      }
    }
    if (!isEmpty(newExperiences)) {
      await this.createNewExperiences(newExperiences, candidate, manager);
    }
  }

  private async createNewExperiences(
    experiences: ExperienceDetail[],
    candidate: Candidate,
    manager: EntityManager
  ) {
    const newExperiences = [];
    for (const experience of experiences) {
      const newExperience = new ExperienceDetail();
      newExperience.candidate = new Candidate();
      newExperience.startDate = experience.startDate;
      newExperience.endDate = experience.endDate;
      newExperience.jobTitle = experience.jobTitle;
      newExperience.jobDescription = experience.jobDescription;
      newExperience.companyName = experience.companyName;
      newExperience.candidate.id = candidate.id;
      newExperiences.push(newExperience);
    }
    await manager.save(newExperiences);
  }

  private async updateContactDetails(
    updateCandidateDto: CreateCandidateDto,
    manager: EntityManager,
    candidate: Candidate
  ): Promise<void> {
    const detailsToUpdate = await ContactDetail.findOne({ where: { user: candidate.user.id } });
    await manager.update(
      ContactDetail,
      { id: detailsToUpdate.id },
      {
        phone: updateCandidateDto.contactDetails.phone,
        linkedinUrl: updateCandidateDto.contactDetails.linkedinUrl,
        facebookUrl: updateCandidateDto.contactDetails.facebookUrl,
        webSite: updateCandidateDto.contactDetails.webSite,
        githubUrl: updateCandidateDto.contactDetails.githubUrl,
        address: updateCandidateDto.contactDetails.address,
      }
    );
  }

  private async updateSkillSets(
    candidateDto: CreateCandidateDto,
    candidate: Candidate,
    manager: EntityManager
  ) {
    const newSkillSets = this.getNewSkills(candidateDto.updateSkillSets);
    const skillsSaved = await manager.save(SkillSet, newSkillSets);
    const candidatesSkillSets = [];
    await this.deleteSkillsNotSelected(candidate, candidateDto.updateSkillSets, manager);
    for (const skill of skillsSaved) {
      const skillCandidate = new CandidateSkillSet();
      skillCandidate.candidateId = candidate.id;
      skillCandidate.skillSetId = skill.id;
      candidatesSkillSets.push(skillCandidate);
    }
    await manager.save(CandidateSkillSet, candidatesSkillSets);
  }

  private async deleteSkillsNotSelected(
    candidate: Candidate,
    skills: SkillSet[],
    manager: EntityManager
  ) {
    const currentSkills = await manager.find(CandidateSkillSet, {
      candidateId: candidate.id,
    });
    const currentSkillsIds = [];
    for (const skill of currentSkills) {
      currentSkillsIds.push(skill.skillSetId);
    }
    for (const skill of skills) {
      const indexFound = findIndex(currentSkillsIds, (id) => {
        return isEqual(id, skill.id);
      });
      if (indexFound != -1) {
        currentSkillsIds.splice(indexFound, 1);
      }
    }
    if (!isEmpty(currentSkillsIds)) {
      await manager.delete(CandidateSkillSet, { skillSetId: In(currentSkillsIds) });
    }
  }

  private getNewSkills(skillSet: SkillSet[]) {
    const newSkills = [];
    for (const skill of skillSet) {
      if (isUndefined(skill.id)) {
        const newSkill = new SkillSet();
        newSkill.name = skill.name;
        newSkill.slug = skill.slug;
        newSkills.push(newSkill);
      }
    }
    return newSkills;
  }
}
