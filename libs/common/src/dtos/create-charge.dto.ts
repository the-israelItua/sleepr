import { CardDto } from "apps/reservations/src/dto/card.dto";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import Stripe from "stripe";

export class CreateChargeDto {
    @IsDefined()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CardDto)
    card: CardDto;

    @IsNumber()
    amount: number;
}