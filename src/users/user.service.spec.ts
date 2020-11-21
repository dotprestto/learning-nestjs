import {
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from 'src/DTO/create-user.dto';
import { FindUsersQueryDto } from 'src/DTO/find-users.dto';
import { UserRepository } from './../users/users.repository';
import { UserRole } from './user-roles.enum';
import { UsersService } from './users.service';

const mockUserRepository = () => ({
	createUser: jest.fn(),
	findOne: jest.fn(),
	delete: jest.fn(),
	findUsers: jest.fn(),
	update: jest.fn(),
});

describe('UsersService', () => {
	let userRepository;
	let service;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: UserRepository,
					useFactory: mockUserRepository,
				},
			],
		}).compile();

		userRepository = await module.get<UserRepository>(UserRepository);
		service = await module.get<UsersService>(UsersService);
	});

	it('shoud be defined', () => {
		expect(service).toBeDefined();
		expect(userRepository).toBeDefined();
	});

	describe('createUser', () => {
		let mockCreateUserDto: CreateUserDto;

		beforeEach(() => {
			mockCreateUserDto = {
				email: 'mock@email.com',
				name: 'Mock User',
				password: 'mockPassword',
				passwordConfirmation: 'mockPassword',
			};
		});

		it('should create an user if passwords match', async () => {
			userRepository.createUser.mockResolvedValue('mockUser');
			const result = await service.createAdminUser(mockCreateUserDto);

			expect(userRepository.createUser).toHaveBeenCalledWith(
				mockCreateUserDto,
				UserRole.ADMIN,
			);
			expect(result).toEqual('mockUser');
		});

		it('should throw an error if passwords doesnt match', async () => {
			mockCreateUserDto.passwordConfirmation = 'wrongPassword';
			expect(service.createAdminUser(mockCreateUserDto)).rejects.toThrow(
				UnprocessableEntityException,
			);
		});
	});

	describe('findUserById', () => {
		it('should return the found user', async () => {
			userRepository.findOne.mockResolvedValue('mockUser');
			expect(userRepository.findOne).not.toHaveBeenCalled();

			const result = await service.findUserById('mockId');
			const select = ['email', 'name', 'role', 'id'];
			expect(userRepository.findOne).toHaveBeenCalledWith('mockId', { select });
			expect(result).toEqual('mockUser');
		});

		it('should throw and error as user user is not found', async () => {
			userRepository.findOne.mockResolvedValue(null);
			expect(service.findUserById('mockId')).rejects.toThrow(NotFoundException);
		});
	});

	describe('deleteUser', () => {
		it('should return affected > 0 if user is deleted', async () => {
			userRepository.delete.mockResolvedValue({ affected: 1 });
			await service.deleteUser('mockId');

			expect(userRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
		});

		it('should throw an error no user is deleted', async () => {
			userRepository.delete.mockResolvedValue({ affected: 0 });

			expect(service.deleteUser('mockId')).rejects.toThrow(NotFoundException);
		});
	});

	describe('findUsers', () => {
		it('should call the findUsers method of the userRepository', async () => {
			userRepository.findUsers.mockResolvedValue('resultOfSearch');
			const mockFindUserQueryDto: FindUsersQueryDto = {
				name: '',
				email: '',
				limit: 1,
				page: 1,
				role: '',
				sort: '',
				status: true,
			};

			const result = await service.findUsers(mockFindUserQueryDto);
			expect(userRepository.findUsers).toHaveBeenCalledWith(
				mockFindUserQueryDto,
			);
			expect(result).toEqual('resultOfSearch');
		});
	});

	describe('updateUser', () => {
		it('should return affected > 0 if user data is updated and return the new user', async () => {
			userRepository.update.mockResolvedValue({ affected: 1 });
			userRepository.findOne.mockResolvedValue('mockUser');

			const result = await service.updateUser('mockUpdateUserDto', 'mockId');

			expect(userRepository.update).toHaveBeenCalledWith(
				{ id: 'mockId' },
				'mockUpdateUserDto',
			);
			expect(result).toEqual('mockUser');
		});

		it('should throw an error if no row is affected in the DB', async () => {
			userRepository.update.mockResolvedValue({ affected: 0 });

			expect(service.updateUser('mockUpdateUserDto', 'mockId')).rejects.toThrow(
				NotFoundException,
			);
		});
	});
});
