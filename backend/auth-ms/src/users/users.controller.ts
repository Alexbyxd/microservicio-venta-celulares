import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto, LoginGoogleDto } from './dto/login-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('loginUser')
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @MessagePattern('loginGoogle')
  loginWithGoogle(@Payload() loginGoogleDto: LoginGoogleDto) {
    return this.usersService.loginWithGoogle(loginGoogleDto);
  }

  @MessagePattern('findUserByEmail')
  findByEmail(@Payload() email: string) {
    return this.usersService.findByEmail(email);
  }

  @MessagePattern('findAllUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: string) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('updateUser')
  update(@Payload() data: { id: string; updateUserDto: Partial<CreateUserDto> }) {
    return this.usersService.update(data.id, data.updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: string) {
    return this.usersService.remove(id);
  }
}
