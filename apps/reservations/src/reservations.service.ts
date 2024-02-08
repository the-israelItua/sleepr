import { PAYMENTS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersDocument } from 'apps/auth/src/users/models/users.schema';
import { map } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    user: UsersDocument,
  ) {
    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email: user.email,
      })
      .pipe(
        map((response) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: response.id,
            timestamp: new Date(),
            userId: user._id?.toString(),
          });
        }),
      );
  }

  findAll() {
    return this.reservationsRepository.find({});
  }

  findOne(id: string) {
    return this.reservationsRepository.findOne({ id });
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      { $set: updateReservationDto },
    );
  }

  remove(id: number) {
    return this.reservationsRepository.findOneAndDelete({ id });
  }
}
