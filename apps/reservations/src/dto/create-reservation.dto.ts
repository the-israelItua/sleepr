import { CreateChargeDto } from "@app/common";
import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { CardDto } from "./card.dto";

export class CreateReservationDto {
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @IsDefined()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateChargeDto)
   charge: CreateChargeDto
}
