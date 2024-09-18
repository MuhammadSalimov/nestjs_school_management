import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(pyload: CreateStudentDto, userId: string) {
    delete pyload.password;
    const newStudent = await this.prisma.student.create({
      data: {
        ...pyload,
        userId,
      },
    });
    return { login: newStudent.admissionNumber };
  }

  async findAll() {
    const student = await this.prisma.student.findMany();
    return student;
  }

  async findOne(id: string) {
    const findStudent = await this.prisma.student.findUnique({
      where: { id },
    });
    if (!findStudent)
      throw new HttpException('Student not found', HttpStatus.BAD_REQUEST);
    return findStudent;
  }

  async update(id: string, pyload: UpdateStudentDto) {
    const findStudent = await this.findOne(id);
    if (pyload?.admissionNumber != findStudent.admissionNumber) {
      await this.prisma.user.update({
        where: { id: findStudent.userId },
        data: { login: pyload.admissionNumber },
      });
    }
    if (pyload?.password) {
      const hashPass = await hash(pyload.password, 10);
      await this.prisma.user.update({
        where: { id: findStudent.userId },
        data: {
          password: hashPass,
        },
      });
    }
    delete pyload.password;
    const updated = await this.prisma.student.update({
      where: { id },
      data: pyload,
    });
    return updated;
  }

  async remove(id: string) {
    const findStudent = await this.findOne(id);
    if (!findStudent) {
      throw new HttpException('Student not found', HttpStatus.BAD_REQUEST);
    }
    if (findStudent.userId) {
      await this.prisma.user.delete({
        where: { id: findStudent.userId },
      });
    }
    return { message: 'deleted' };
  }
}
