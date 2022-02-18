import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CustomerBillingRatesQueryParams{
  @IsOptional()
  @IsString()
  customer_id: number;

  @IsOptional()
  @IsNumber()
  project_id: number;

  @IsNotEmpty()
  @IsIn(
    [
      'global',
      'customer',
      'project'
    ]
  )
  view: string;
}
