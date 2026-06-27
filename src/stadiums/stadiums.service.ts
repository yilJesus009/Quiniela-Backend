import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stadium } from './stadium.entity';
import { Match } from '../matches/match.entity';

@Injectable()
export class StadiumsService {
  constructor(
    @InjectRepository(Stadium) private stadiumRepo: Repository<Stadium>,
    @InjectRepository(Match)   private matchRepo: Repository<Match>,
  ) {}

  findAll() {
    return this.stadiumRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const stadium = await this.stadiumRepo.findOne({ where: { id } });
    if (!stadium) throw new NotFoundException('Estadio no encontrado.');
    return stadium;
  }

  async findMatchesByStadium(id: number) {
    await this.findOne(id);
    return this.matchRepo.find({
      where: { stadiumId: id },
      order: { matchDate: 'ASC' },
    });
  }
}
