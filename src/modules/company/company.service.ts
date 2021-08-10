import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Company } from "./entities/company.entity";
import { CompanyEmailService } from "./company-mail.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { BadRequestException, NotFoundException } from "src/error/exceptions";
import { Role } from "../user/entities/role.entity";
import { RoleType, User } from "../user/entities/user.entity";
import { head, isEmpty, isUndefined } from "lodash";
import { companyLabels } from "./company-labels";

@Injectable()
export class CompanyService {

    constructor(
        @InjectRepository(Company) private companyRepository: Repository<Company>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        private companyEmailService: CompanyEmailService
    ) {}

    public async createCompany(company: CreateCompanyDto): Promise<Company> {
        const companyToCreate: Company = await this.fillCompanyToCreate(company);
        return this.companyRepository.save(companyToCreate);
    }

    public async inviteCompany(companyToInvite: CreateCompanyDto): Promise<Company> {
        await this.companyEmailService.sendInvitation(companyToInvite);
        const companyToCreate = await this.fillCompanyToCreate(companyToInvite);
        return this.companyRepository.save(companyToCreate);
    }

    public async retrieveCompanies(): Promise<Company[]> {
        const companyFilter: Company = new Company();
        companyFilter.isActive = true;
        let foundCompanies: Company[] = await this.companyRepository.find(companyFilter);
        if (isEmpty(foundCompanies)) {
            throw new NotFoundException(companyLabels.errors.companiesNotFound);
        }
        return foundCompanies;
    }

    public async retrieveOneCompany(companyId: number): Promise<Company> {
        const companyFilter: Company = new Company();
        let companyFound: Company;
        companyFilter.isActive = true;
        companyFilter.id = companyId;
        if (isUndefined(companyId)) { 
            throw new BadRequestException(companyLabels.errors.noIdProvided);
        }
        companyFound = head(await this.companyRepository.find(companyFilter));
        if (isUndefined(companyFound)) {
            throw new NotFoundException(companyLabels.errors.companyNotFound);
        }
        return companyFound;
    }

    public async updateCompany(id: number, company: Company): Promise<Company> {
        let updatedCompany: any;
        if (isUndefined(id)) {
            throw new BadRequestException(companyLabels.errors.noIdProvided);
        }
        updatedCompany = await this.companyRepository.update({id: id}, company);
        if (isUndefined(updatedCompany)) {
            throw new NotFoundException(companyLabels.errors.updateCompanyError);
        }
        return company;
    }

    public async deleteCompany(id: number): Promise<Company> {
        const companyToDelete: Company = new Company();
        companyToDelete.isActive = false;
        if (isUndefined(id)) { throw new BadRequestException(companyLabels.errors.noIdProvided); }
        await this.companyRepository.update({id: id}, companyToDelete);
        companyToDelete.id = id;
        return companyToDelete;
    }

    private async fillCompanyToCreate(company: CreateCompanyDto): Promise<Company> {
        const createdUser: User = await this.createUserForCompany(company);
        const companyToCreate: Company = company.company;
        companyToCreate.user = createdUser;
        companyToCreate.createdAt = new Date();
        companyToCreate.updatedAt = companyToCreate.updatedAt;
        return companyToCreate;
    }

    private async createUserForCompany(company: CreateCompanyDto): Promise<User> {
        const user: User = new User();
        const role: Role = await this.roleRepository.findOne({ name: RoleType.EMPLOYER });
        user.email = company.email;
        user.createdAt = new Date();
        user.updatedAt = user.createdAt;
        user.role = role;
        return await this.userRepository.save(user);
    }
}