import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { Company } from "./entities/company.entity";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";

@Controller('company')
export class CompanyController {

    constructor(private companyService: CompanyService) {}

    @Post("")
    // @Allow(RoleType.ADMIN)
    createCompany(@Body() createCompanyDto?: CreateCompanyDto) {
        return this.companyService.createCompany(createCompanyDto);
    }

    @Post("invite")
    inviteCompany(@Body() companyToInvite: CreateCompanyDto) {
        return this.companyService.inviteCompany(companyToInvite);
    }

    @Get("")
    retrieveCompanies() {
        return this.companyService.retrieveCompanies();
    }

    @Get(":id")
    retrieveCompanyById(@Param('id') id: number) {
        return this.companyService.retrieveOneCompany(id);
    }

    @Put(":id")
    updateCompany(@Param('id') id: number, @Body() company: Company) {
        return this.companyService.updateCompany(id, company);
    }

    @Delete(":id")
    deleteCompany(@Param('id') id: number) {
        return this.companyService.deleteCompany(id);
    }
}