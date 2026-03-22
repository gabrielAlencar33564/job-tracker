import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  jobId: string;
}
