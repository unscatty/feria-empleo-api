import { AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { findIndex, isEmpty, isEqual, isUndefined } from 'lodash';
import { EntityManager, getManager, In, Repository, SelectQueryBuilder } from 'typeorm';
import { SkillSet } from '../skill-set/entities/skill-set.entity';
import { ContactDetail } from '../user/entities/contact-detail.entity';
import { Role, RoleType } from '../user/entities/role.entity';
import { User } from '../user/entities/user.entity';
import {
  CreateCandidateDto,
  ContactDetailsDto,
  ExperienceDetailDto,
} from './dto/create-candidate.dto';
import { FilterCandidateDto } from './dto/filter-candidate.dto';
import { CandidateSkillSet } from './models/candidate-skill-set.entity';
import { Candidate } from './models/candidate.entity';
import { EducationDetail } from './models/education-detail.entity';
import { ExperienceDetail } from './models/experience-detail.entity';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { EducationDetailDto } from './dto/create-candidate.dto';

@Injectable()
export class CandidateService {
  private queryBuilder: () => SelectQueryBuilder<Candidate>;

  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(ContactDetail)
    private contactDetailsRepository: Repository<ContactDetail>,
    @InjectRepository(EducationDetail)
    private educationDetailsRepository: Repository<EducationDetail>,
    @InjectRepository(ExperienceDetail)
    private experienceDetailsRepository: Repository<ExperienceDetail>,
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
        ...createCandidateDto,
        role,
      });

      // await manager.save(newUser);
      let candidate = manager.create(Candidate, {
        user: newUser,
      });
      candidate = await manager.save(candidate);

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
          experienceDetails.push(
            manager.create(ExperienceDetail, { ...detail, candidate: candidate.id })
          );
        }
        candidate.experienceDetails = experienceDetails;
      }
      if (createCandidateDto.educationDetails) {
        const educationDetails = [];
        for (const detail of createCandidateDto.educationDetails) {
          educationDetails.push(
            manager.create(EducationDetail, { ...detail, candidate: candidate.id })
          );
        }
        candidate.educationDetails = educationDetails;
      }

      return manager.save(candidate);
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
      return { url };
    }
  }

  async updateCandidate(
    updateCandidateDto: UpdateCandidateDto,
    manager: EntityManager,
    candidate: Candidate
  ) {
    if (updateCandidateDto.contactDetails) {
      await this.updateContactDetails(updateCandidateDto.contactDetails, manager, candidate);
    }
    if (updateCandidateDto.skillSets) {
      await this.updateSkillSets(updateCandidateDto.skillSets, candidate, manager);
    }
    if (updateCandidateDto.experienceDetails) {
      await this.updateExperienceDetails(updateCandidateDto.experienceDetails, candidate, manager);
    }

    if (updateCandidateDto.educationDetails) {
      await this.updateEducationDetails(updateCandidateDto.educationDetails, candidate, manager);
    }
  }

  private async updateExperienceDetails(
    experienceDetails: ExperienceDetailDto[],
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

  async updateEducationDetails(
    educationDetails: EducationDetailDto[],
    candidate: Candidate,
    manager: EntityManager
  ) {
    const newEducationDetails = [];
    for (const education of educationDetails) {
      if (isUndefined(education.id)) {
        newEducationDetails.push(
          manager.create(EducationDetail, { ...education, candidate: candidate.id })
        );
      } else {
        await manager.update(
          EducationDetail,
          { id: education.id },
          {
            institutionName: education.institutionName,
            degree: education.degree,
            level: education.level,
            startDate: education.startDate,
            endDate: education.endDate,
            currentlyInSchool: education.currentlyInSchool,
            description: education.description,
          }
        );
      }
    }
    if (!isEmpty(newEducationDetails)) {
      await manager.save(newEducationDetails);
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
    contactDetails: ContactDetailsDto,
    manager: EntityManager,
    candidate: Candidate
  ): Promise<void> {
    const detailsToUpdate = await ContactDetail.findOne({ where: { user: candidate.user.id } });
    if (!detailsToUpdate) {
      await manager.save(ContactDetail, {
        phone: contactDetails.phone,
        linkedinUrl: contactDetails.linkedinUrl,
        facebookUrl: contactDetails.facebookUrl,
        webSite: contactDetails.webSite,
        githubUrl: contactDetails.githubUrl,
        address: contactDetails.address,
        user: candidate.user.id,
      });
    } else {
      await manager.update(
        ContactDetail,
        { id: detailsToUpdate.id },
        {
          phone: contactDetails.phone,
          linkedinUrl: contactDetails.linkedinUrl,
          facebookUrl: contactDetails.facebookUrl,
          webSite: contactDetails.webSite,
          githubUrl: contactDetails.githubUrl,
          address: contactDetails.address,
        }
      );
    }
  }

  private async updateSkillSets(skillSets: number[], candidate: Candidate, manager: EntityManager) {
    const currentSkillSets = await manager.find(CandidateSkillSet, {
      candidateId: candidate.id,
    });
    const skillSetsAdded = skillSets.filter(
      (skill) => !currentSkillSets.some(({ skillSetId }: any) => skill === skillSetId)
    );
    const skillSetsDeleted = currentSkillSets.filter(
      (s) => !skillSets.some((skill) => s.skillSetId === skill)
    );
    console.log('skillSetsAdded', skillSetsAdded);
    console.log('skillSetsDeleted', skillSetsDeleted);

    if (skillSetsAdded.length) {
      const newSkills = skillSetsAdded.map((skill) =>
        manager.create(CandidateSkillSet, { skillSetId: skill, candidateId: candidate.id })
      );
      await manager.insert(CandidateSkillSet, newSkills);
    }

    if (skillSetsDeleted.length) {
      const ids = skillSetsDeleted.map((skill) => skill.skillSetId);
      await manager.delete(CandidateSkillSet, {
        candidateId: candidate.id,
        skillSetId: In(ids),
      });
    }
  }

  async deleteEducationDetail(id: number, candidate: Candidate) {
    const res = await this.educationDetailsRepository.delete({ id: id, candidate: candidate.id });
    if (res.affected > 0) {
      return { affected: true };
    }
    return { affected: false };
  }

  async deleteExperienceDetail(id: number, candidate: Candidate) {
    const res = await this.experienceDetailsRepository.delete({ id: id, candidate: candidate.id });
    if (res.affected > 0) {
      return { affected: true };
    }
    return { affected: false };
  }
}
