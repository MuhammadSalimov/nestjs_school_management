import { ApiProperty } from '@nestjs/swagger';
import { role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: '1234' })
  login: string;

  @ApiProperty({ example: '1234' })
  password: string;
  @ApiProperty({ example: '1234' })
  role: role;
  @ApiProperty({ example: '1234' })
  picture: string;
}
