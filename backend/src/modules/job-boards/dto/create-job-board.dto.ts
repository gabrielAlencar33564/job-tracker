import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateJobBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
