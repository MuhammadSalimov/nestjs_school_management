import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}
  async create(pyload: CreateTeacherDto, userId: string) {
    delete pyload.password;
    pyload.userId = userId;
    const newTeacher = await this.prisma.teacher.create({
      data: { ...pyload },
    });
    return { login: newTeacher.teacherID };
  }

  async findAll() {
    return await this.prisma.teacher.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.teacher.findUnique({ where: { id } });
  }

  update(id: string, body: UpdateTeacherDto) {
    console.log(body);
    return `This action updates a #${id} teacher`;
  }

  async remove(id: string) {
    return await this.prisma.teacher.delete({ where: { id } });
  }
}
