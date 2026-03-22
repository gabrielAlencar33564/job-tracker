import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get('job/:jobId')
  findByJobId(@Param('jobId', ParseUUIDPipe) jobId: string) {
    return this.notesService.findByJobId(jobId);
  }
}
