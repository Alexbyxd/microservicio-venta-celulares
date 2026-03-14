import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto, LoginGoogleDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { envs } from '../config/envs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(private prisma: PrismaService) {}

  private generateToken(user: { id: string; email: string }): string {
    return jwt.sign(
      { sub: user.id, email: user.email },
      envs.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El usuario ya existe con este email');
    }

    let hashedPassword: string | undefined;
    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        pictureUrl: createUserDto.pictureUrl,
        password: hashedPassword,
        googleId: createUserDto.googleId,
      },
    });

    const token = this.generateToken({ id: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    if (!user.password) {
      throw new UnauthorizedException('Este usuario se registró con Google. Por favor, inicia sesión con Google.');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const token = this.generateToken({ id: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async loginWithGoogle(loginGoogleDto: LoginGoogleDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: loginGoogleDto.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: loginGoogleDto.email,
          firstName: loginGoogleDto.firstName,
          lastName: loginGoogleDto.lastName,
          pictureUrl: loginGoogleDto.pictureUrl,
          googleId: loginGoogleDto.googleId,
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: loginGoogleDto.googleId,
          pictureUrl: loginGoogleDto.pictureUrl || user.pictureUrl,
        },
      });
    }

    const token = this.generateToken({ id: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: Partial<CreateUserDto>) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
