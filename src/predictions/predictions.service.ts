import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from './prediction.entity';
import { Match } from '../matches/match.entity';
import { CreatePredictionDto } from './predictions.dto';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Prediction) private predRepo: Repository<Prediction>,
    @InjectRepository(Match) private matchRepo: Repository<Match>,
  ) {}

  async upsert(dto: CreatePredictionDto, userId: number) {
    const match = await this.matchRepo.findOne({ where: { id: dto.match_id } });
    if (!match) throw new NotFoundException('Partido no encontrado.');

    // Bloquear si el partido ya inició
    if (match.status !== 'scheduled' || match.matchDate <= new Date()) {
      throw new UnprocessableEntityException(
        'No se puede pronosticar un partido en curso o finalizado.',
      );
    }

    // Upsert: buscar si ya existe un pronóstico del usuario para ese partido
    let prediction = await this.predRepo.findOne({
      where: { userId, matchId: dto.match_id },
    });

    if (prediction) {
      prediction.homeScore = dto.home_score;
      prediction.awayScore = dto.away_score;
      prediction.status = 'pending';
      prediction.pointsEarned = 0;
    } else {
      prediction = this.predRepo.create({
        userId,
        matchId: dto.match_id,
        homeScore: dto.home_score,
        awayScore: dto.away_score,
      });
    }

    await this.predRepo.save(prediction);

    return {
      message: 'Pronóstico registrado.',
      prediction: {
        id: prediction.id,
        match_id: prediction.matchId,
        home_score: prediction.homeScore,
        away_score: prediction.awayScore,
        status: prediction.status,
      },
    };
  }

  async findMyPredictions(userId: number) {
    const predictions = await this.predRepo.find({
      where: { userId },
      relations: { match: true },
      order: { createdAt: 'DESC' },
    });

    return predictions.map((p) => ({
      id: p.id,
      match_id: p.matchId,
      home_score: p.homeScore,
      away_score: p.awayScore,
      points_earned: p.pointsEarned,
      status: p.status,
      match: p.match
        ? {
            id: p.match.id,
            home_team: p.match.homeTeam,
            away_team: p.match.awayTeam,
            match_date: p.match.matchDate,
            status: p.match.status,
            home_score: p.match.homeScore,
            away_score: p.match.awayScore,
            phase: p.match.phase,
          }
        : null,
    }));
  }

  async calculatePointsForMatch(matchId: number) {
    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    if (
      !match ||
      match.status !== 'finished' ||
      match.homeScore === null ||
      match.awayScore === null
    )
      return;

    const predictions = await this.predRepo.find({ where: { matchId } });

    const realHome = match.homeScore;
    const realAway = match.awayScore;
    for (const pred of predictions) {
      if (pred.homeScore === realHome && pred.awayScore === realAway) {
        pred.pointsEarned = 3;
        pred.status = 'correct_score';
      } else {
        const realWinner =
          realHome > realAway ? 'home' : realHome < realAway ? 'away' : 'draw';
        const predWinner =
          pred.homeScore > pred.awayScore
            ? 'home'
            : pred.homeScore < pred.awayScore
              ? 'away'
              : 'draw';

        if (realWinner === predWinner) {
          pred.pointsEarned = 1;
          pred.status = 'correct_winner';
        } else {
          pred.pointsEarned = 0;
          pred.status = 'incorrect';
        }
      }
    }
    await this.predRepo.save(predictions);
  }
}
