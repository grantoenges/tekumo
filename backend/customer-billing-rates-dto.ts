import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CustomerBillingRatesDto{
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @Transform(raw => {
    return +raw.value || null;
  })
  @IsNumber()
  customerId: number;

  @IsOptional()
  @Transform(raw => {
    return +raw.value || null;
  })
  @IsNumber()
  projectId: number;

  @IsOptional()
  @Transform(raw => {
    return +raw.value || null;
  })
  @IsNumber()
  slaId: number;

  @IsOptional()
  @IsString()
  slaName: string;

  @IsOptional()
  @IsNumber()
  laborHourlyBillRate: number;

  @IsOptional()
  @IsNumber()
  laborMinimumCharge: number;

  @IsOptional()
  @IsNumber()
  laborMaximumCharge: number;

  @IsOptional()
  @IsNumber()
  travelMarkupRate: number;

  @IsOptional()
  @IsNumber()
  freightMarkupRate: number;

  @IsOptional()
  @IsNumber()
  partsMarkupRate: number;

  @IsOptional()
  @IsString()
  customerName: string;

  @IsOptional()
  @IsNumber()
  fixedHourlyRate: number;

  @IsOptional()
  @IsNumber()
  fixedHours: number;

  @IsOptional()
  @IsNumber()
  additionalHourlyRate: number;

  @IsOptional()
  @IsNumber()
  additionalHours: number;

  @IsOptional()
  @IsString()
  roundingRule: string;

  @IsOptional()
  @IsString()
  roundingMode: string;

  @Transform(raw => isNaN(+raw.value) ? 0 : +raw.value)
  @IsOptional()
  @IsNumber()
  netsuiteItemId: number;

  @IsOptional()
  @IsString()
  netsuiteItemName: string;
}
