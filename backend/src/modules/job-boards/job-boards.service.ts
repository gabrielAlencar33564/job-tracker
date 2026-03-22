import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobBoardDto } from './dto/create-job-board.dto';
import { UpdateJobBoardDto } from './dto/update-job-board.dto';

@Injectable()
export class JobBoardsService {
  constructor(private readonly prisma: PrismaService) { }

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

  async update(id: string, updateJobBoardDto: UpdateJobBoardDto) {
    const jobBoard = await this.prisma.jobBoard.findUnique({
      where: { id },
    });

    if (!jobBoard) {
      throw new NotFoundException(`Job Board with ID "${id}" not found`);
    }

    return this.prisma.jobBoard.update({
      where: { id },
      data: updateJobBoardDto,
    });
  }
}
