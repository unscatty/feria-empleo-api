import { IsEmail, IsNotEmpty } from "class-validator";
import { Company } from "../entities/company.entity";

export class CreateCompanyDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    company: Company;

}
