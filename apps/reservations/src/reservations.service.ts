import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepository: ReservationsRepository){}

  create(createReservationDto: CreateReservationDto) {
    return this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId: "123"
    })
  }

  findAll() {
    return this.reservationsRepository.find({})
  }

  findOne(id: string) {
    return this.reservationsRepository.findOne({id})
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({id}, {$set: updateReservationDto})
  }

  remove(id: number) {
    return  this.reservationsRepository.findOneAndDelete({id})
  }
}
