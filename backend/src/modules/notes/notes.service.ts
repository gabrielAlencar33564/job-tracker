import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createNoteDto: CreateNoteDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: createNoteDto.jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${createNoteDto.jobId} not found`);
    }

    return this.prisma.note.create({
      data: createNoteDto,
    });
  }

  async findByJobId(jobId: string) {
    return this.prisma.note.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
