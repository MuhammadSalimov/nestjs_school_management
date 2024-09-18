import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsDate, IsNotEmpty } from 'class-validator';
import { gender, section } from '@prisma/client'; // Adjust the import if necessary

export class CreateTeacherDto {
  @ApiProperty({ example: '4e3cb9f2-16e3-4d7b-bb11-9a1c9a0e86b5' })
  @IsString()
  userId: string;
  @ApiProperty({ example: 'T001' })
  @IsString()
  @IsNotEmpty()
  teacherID: string;
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  class: string;
  @ApiProperty({ example: 'Algebra' })
  @IsString()
  @IsNotEmpty()
  subject: string;
  @ApiProperty({ example: 'male' })
  @IsEnum(gender)
  @IsNotEmpty()
  gender: gender;
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;
  @ApiProperty({ example: '2000-01-01T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  birthday: string;

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  section: section;

  @ApiProperty({ example: 'write about the teacher' })
  @IsString()
  @IsNotEmpty()
  notes: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  picture: string;
  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
