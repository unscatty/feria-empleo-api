import { IsNotEmpty } from "class-validator";

export class FilterCandidateDto {
    @IsNotEmpty()
    id: string;
}