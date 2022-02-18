import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AllowedAuthorityLevels } from '../../../common/decorators/allowed-authority-levels.decorator';
import { Authority } from '../../../common/enums/Authority';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ResponseTransformerInterceptor } from '../../../common/interceptors/response-transformer.interceptor';
import { CustomerBillingRatesService } from '../services/customer-billing-rates.service';
import { CustomerBillingRatesDto } from '../dto/customer-billing-rates-dto';
import { CustomerBillingRatesQueryParams } from '../dto/customer-billing-reates-query-params';
import { AuthorityGuard } from '../../../common/guards/authority.guard';

@Controller()
@AllowedAuthorityLevels(Authority.ADMIN, Authority.DISPATCHER, Authority.DISPATCH_ADMIN, Authority.BILLING_ADMIN, Authority.TECHNICIAN)
@UseGuards(AuthGuard, AuthGuard)
export class CustomerBillingRatesController {
  constructor(private customerBillingRatesService: CustomerBillingRatesService) {}

  @AllowedAuthorityLevels(Authority.ADMIN, Authority.DISPATCHER, Authority.DISPATCH_ADMIN, Authority.BILLING_ADMIN, Authority.TECHNICIAN)
  @UseGuards(AuthGuard, AuthorityGuard)
  @UseInterceptors(ResponseTransformerInterceptor)
  @Get('')
  async getAllCustomerBillingRates(@Query(new ValidationPipe({transform: true})) query: CustomerBillingRatesQueryParams): Promise<CustomerBillingRatesDto[]> {
    return this.customerBillingRatesService.getAllCustomerBillingRates(query);
  }

  @AllowedAuthorityLevels(Authority.ADMIN, Authority.DISPATCHER, Authority.DISPATCH_ADMIN, Authority.BILLING_ADMIN, Authority.TECHNICIAN)
  @UseGuards(AuthGuard, AuthGuard)
  @Post('')
  async createNewCustomerBillingRate(@Body() newCbr: CustomerBillingRatesDto): Promise<CustomerBillingRatesDto> {
    return this.customerBillingRatesService.createNewCustomerBillingRate(newCbr);
  }

  @AllowedAuthorityLevels(Authority.ADMIN, Authority.DISPATCHER, Authority.DISPATCH_ADMIN, Authority.BILLING_ADMIN, Authority.TECHNICIAN)
  @UseGuards(AuthGuard, AuthGuard)
  @Put('/update')
  async updateCustomerBillingRate(@Body() updatedCbr: CustomerBillingRatesDto): Promise<CustomerBillingRatesDto> {
    return this.customerBillingRatesService.updateCustomerBillingRate(updatedCbr);
  }

  @AllowedAuthorityLevels(Authority.ADMIN, Authority.DISPATCHER, Authority.DISPATCH_ADMIN, Authority.BILLING_ADMIN, Authority.TECHNICIAN)
  @UseGuards(AuthGuard, AuthGuard)
  @Delete('')
  async deleteCustomerBillingRate(@Body() cbrToDelete: CustomerBillingRatesDto): Promise<CustomerBillingRatesDto> {
    return this.customerBillingRatesService.deleteCustomerBillingRateById(cbrToDelete);
  }

  @AllowedAuthorityLevels(Authority.ADMIN, Authority.DISPATCHER, Authority.DISPATCH_ADMIN, Authority.BILLING_ADMIN, Authority.TECHNICIAN)
  @UseGuards(AuthGuard, AuthGuard)
  @UseInterceptors(ResponseTransformerInterceptor)
  @Get('appropriate-billing-rate')
  async getAppropriateBillingRate(@Query('customerId') customerId: number, @Query('projectId') projectId: number, @Query('slaTypeId') slaTypeId: number): Promise<CustomerBillingRatesDto> {
    return this.customerBillingRatesService.getAppropriateBillingRate(+customerId, +projectId, +slaTypeId);
  }

}
