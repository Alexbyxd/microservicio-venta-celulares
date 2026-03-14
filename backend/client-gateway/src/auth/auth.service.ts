import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto, LoginDto, LoginGoogleDto } from './dto/auth.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const result = await firstValueFrom(
        this.authClient.send('createUser', registerDto)
      );
      return result;
    } catch (error: any) {
      let message = 'Error al registrar usuario';
      
      if (error?.message) {
        if (typeof error.message === 'string') {
          message = error.message;
        } else if (typeof error.message === 'object' && error.message?.message) {
          message = error.message.message;
        }
      }
      
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const result = await firstValueFrom(
        this.authClient.send('loginUser', loginDto)
      );
      return result;
    } catch (error: any) {
      let message = 'Email o contraseña incorrectos';
      
      if (error?.message) {
        if (typeof error.message === 'string') {
          message = error.message;
        } else if (typeof error.message === 'object' && error.message?.message) {
          message = error.message.message;
        }
      }
      
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  async loginWithGoogle(loginGoogleDto: LoginGoogleDto) {
    try {
      const result = await firstValueFrom(
        this.authClient.send('loginGoogle', loginGoogleDto)
      );
      return result;
    } catch (error: any) {
      let message = 'Error al iniciar sesión con Google';
      
      if (error?.message) {
        if (typeof error.message === 'string') {
          message = error.message;
        } else if (typeof error.message === 'object' && error.message?.message) {
          message = error.message.message;
        }
      }
      
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return firstValueFrom(this.authClient.send('findAllUsers', {}));
  }

  findOne(id: string) {
    return firstValueFrom(this.authClient.send('findOneUser', id));
  }
}
