import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobBoardDto } from './dto/create-job-board.dto';

@Injectable()
export class JobBoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobBoardDto: CreateJobBoardDto) {
    return this.prisma.jobBoard.create({
      data: createJobBoardDto,
    });
  }

  async findAll() {
    return this.prisma.jobBoard.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
