import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsInt,
  IsDate,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Section {
  A = 'A',
  B = 'B',
}

enum Gender {
  male = 'male',
  female = 'female',
}

export class CreateStudentDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'asd1532' })
  @IsString()
  password: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '2000-01-01T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  picture: string;

  @ApiProperty({ example: '2000-01-01T00:00:00.000Z' })
  @IsDate()
  @Type(() => Date)
  dateofBirth: Date;

  @ApiProperty({ enum: Gender, example: Gender.male })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 12345 })
  @IsInt()
  rollNumber: number;

  @ApiProperty({ example: 'A123456' })
  @IsString()
  admissionNumber: string;

  @ApiProperty({ example: '2023-08-27T00:00:00.000Z' })
  @IsDate()
  @Type(() => Date)
  admissionDate: Date;

  @ApiProperty({ example: '10th Grade' })
  @IsString()
  class: string;

  @ApiProperty({ enum: Section, example: Section.A })
  @IsEnum(Section)
  section: Section;
}
