import { Injectable } from '@nestjs/common';

// user structure
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  // Array to store users in memory
  private users: User[] = [];
  // Method to add a new user
  create(user: User) {
    this.users.push(user);
    return user;
  }
  // Method to return all users
  findAll(): User[] {
    return this.users;
  }
}