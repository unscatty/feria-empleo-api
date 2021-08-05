import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as _ from "lodash";

import { Company } from "./entities/company.entity";
import { CompanyEmailService } from "./company-mail.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { CustomLogs } from "src/library/winston/winston.logs";
import { Role } from "../user/entities/role.entity";
import { RoleType, User } from "../user/entities/user.entity";

@Injectable()
export class CompanyService {

    constructor(
        @InjectRepository(Company) private companyRepository: Repository<Company>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        private companyEmailService: CompanyEmailService
    ) {}

    public async createCompany(company: CreateCompanyDto): Promise<Company> {
        try {
            const companyToCreate: Company = await this.fillCompanyToCreate(company);
            return this.companyRepository.save(companyToCreate);
        } catch (error) {
            CustomLogs.logError(error);
            throw error
        }
    }

    public async inviteCompany(companyToInvite: CreateCompanyDto): Promise<Company> {
        try {
            await this.companyEmailService.sendInvitation(companyToInvite);
            const companyToCreate = await this.fillCompanyToCreate(companyToInvite);
            return this.companyRepository.save(companyToCreate);
        } catch (error) {
            CustomLogs.logError(error);
            throw error;
        }
    }

    public async retrieveCompanies(): Promise<Company[]> {
        try {
            const companyFilter: Company = new Company();
            companyFilter.isActive = true;
            let foundCompanies: Company[] = await this.companyRepository.find(companyFilter);
            if (_.isEmpty(foundCompanies)) {
                throw new Error("No companies found");
            }
            return foundCompanies;
        } catch (error) {
            CustomLogs.logError(error);
            throw error;
        }
    }

    public async retrieveOneCompany(companyId: number): Promise<Company> {
        try {
            const companyFilter: Company = new Company();
            let companyFound: Company;
            companyFilter.isActive = true;
            companyFilter.id = companyId;
            if (_.isUndefined(companyId)) { throw new Error("No id provided"); }
            companyFound = _.head(await this.companyRepository.find(companyFilter));
            if (_.isUndefined(companyFound)) { throw new Error("No company found"); }
            return companyFound;
        } catch (error) {
            CustomLogs.logError(error);
            throw error;
        }
    }

    public async updateCompany(id: number, company: Company): Promise<Company> {
        try {
            let updatedCompany: any;
            if (_.isUndefined(id)) { throw new Error("No id provided"); }
            updatedCompany = await this.companyRepository.update({id: id}, company);
            if (_.isUndefined(updatedCompany)) { throw new Error("Error updating company"); }
            return company;
        } catch (error) {
            CustomLogs.logError(error);
            throw error;
        }
    }

    public async deleteCompany(id: number): Promise<Company> {
        try {
            const companyToDelete: Company = new Company();
            companyToDelete.isActive = false;
            if (_.isUndefined(id)) { throw new Error("No id provided"); }
            await this.companyRepository.update({id: id}, companyToDelete);
            companyToDelete.id = id;
            return companyToDelete;
        } catch (error) {
            CustomLogs.logError(error);
            throw error;
        }
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
        try {
            const user: User = new User();
            const role: Role = await this.roleRepository.findOne({ name: RoleType.EMPLOYER });
            user.email = company.email;
            user.createdAt = new Date();
            user.updatedAt = user.createdAt;
            user.role = role;
            return await this.userRepository.save(user);
        } catch (error) {
            CustomLogs.logError(error);
            throw error;
        }
    }
}