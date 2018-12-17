import { ApiModelProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterPayload {
  @ApiModelProperty({
    required: true
  })
  @IsEmail()
  email: string;

  @ApiModelProperty({
    required: true
  })
  @IsNotEmpty()
  firstName: string;

  @ApiModelProperty({
    required: true
  })
  @IsNotEmpty()
  lastName: string;

  @ApiModelProperty({
    required: true
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
