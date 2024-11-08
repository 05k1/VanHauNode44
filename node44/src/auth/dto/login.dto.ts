import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email khong dung dinh dang' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password khong duoc de trong' })
  @ApiProperty()
  pass_word: string;
}
