import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentCreateChargeDto } from './dtos/payment-create-charge.dto';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

 @MessagePattern("create_charge")
 async createCharge(@Payload() data: PaymentCreateChargeDto){
  return this.paymentsService.createCharge(data)
 }
}
