import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/DTO/create-user.dto';
import { FindUsersQueryDto } from 'src/DTO/find-users.dto';
import { UpdateUserDto } from 'src/DTO/update-user.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
	) {}

	async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
		if (createUserDto.password != createUserDto.passwordConfirmation)
			throw new UnprocessableEntityException('As senhas não conferem');
		else return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
	}

	async findUserById(userId: string): Promise<User> {
		const user = await this.userRepository.findOne(userId, {
			select: ['email', 'name', 'role', 'id'],
		});

		if (!user) throw new NotFoundException('Usuário não encontrado');

		return user;
	}

	async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
		const result = await this.userRepository.update({ id }, updateUserDto);
		if (result.affected > 0) {
			const user = await this.findUserById(id);
			return user;
		} else throw new NotFoundException('Usuário não encontrado');
	}

	async deleteUser(userId: string) {
		const result = await this.userRepository.delete({ id: userId });
		if (result.affected === 0)
			throw new NotFoundException(
				'Não foi encontrado um usuário com o ID informado',
			);
	}

	async findUsers(
		queryDto: FindUsersQueryDto,
	): Promise<{ users: User[]; total: number }> {
		const users = await this.userRepository.findUsers(queryDto);
		return users;
	}
}
