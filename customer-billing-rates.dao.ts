import { DatabaseService } from '../../shared/services/database.service';
import { CustomerBillingRatesDto } from '../dto/customer-billing-rates-dto';
import { plainToClass } from 'class-transformer';
import * as knexnest from 'knexnest';
import { Injectable } from '@nestjs/common';
import { CustomerBillingRatesQueryParams } from '../dto/customer-billing-reates-query-params';

@Injectable()
export class CustomerBillingRatesDao{
  constructor(private databaseService: DatabaseService) {}

  async getAllCustomerBillingRates(params: CustomerBillingRatesQueryParams): Promise<CustomerBillingRatesDto[]>{
    const db = await this.databaseService.getConnection();
    const projectFields = [
      'cbr.customer_id AS _customerId', 'customers.name AS _customerName', 'cbr.id AS _project__id', 'projects.name AS _project__projectName', 'cbr.sla_type_id AS _project__slaId',
      'cbr.fixed_hourly_rate AS _project__fixedHourlyRate', 'cbr.fixed_hours AS _project__fixedHours', 'cbr.additional_hourly_rate AS _project__additionalHourlyRate',
      'cbr.additional_hours AS _project__additionalHours', 'cbr.billing_rounding_rule AS _project__roundingRule', 'cbr.billing_rounding_mode AS _project__roundingMode',
      'sla_types.name AS _project__slaName', 'customers.name AS _project__customerName', 'projects.id AS _project__projectId', 'cbr.customer_id AS _project__customerId'
    ]
    const customerFields = [
      'cbr.customer_id AS _customerId', 'customers.name AS _customerName', 'cbr.id AS _cbr__id', 'cbr.project_id AS _cbr__projectId',  'cbr.sla_type_id AS _cbr__slaId',
      'cbr.fixed_hourly_rate AS _cbr__fixedHourlyRate', 'cbr.fixed_hours AS _cbr__fixedHours', 'cbr.additional_hourly_rate AS _cbr__additionalHourlyRate',
      'cbr.additional_hours AS _cbr__additionalHours', 'cbr.billing_rounding_rule AS _cbr__roundingRule', 'cbr.billing_rounding_mode AS _cbr__roundingMode',
      'sla_types.name AS _cbr__slaName', 'customers.name AS _cbr__customerName', 'cbr.customer_id AS _cbr__customerId'
    ]
    const globalFields = [
      'cbr.id AS _id', 'cbr.customer_id AS _customerId', 'cbr.project_id AS _projectId', 'cbr.sla_type_id AS _slaId', 'cbr.fixed_hourly_rate AS _fixedHourlyRate', 'cbr.fixed_hours AS _fixedHours',
      'cbr.additional_hourly_rate AS _additionalHourlyRate', 'cbr.additional_hours AS _additionalHours', 'cbr.billing_rounding_rule AS _roundingRule', 'cbr.billing_rounding_mode AS _roundingMode',
      'customers.name AS _customerName', 'sla_types.name AS _slaName',
      'cbr.netsuite_item_id AS _netsuiteItemId', 'cbr.netsuite_item_name AS _netsuiteItemName'
    ];

    let sql;
    if (params.view === 'global'){
      sql = db.select(globalFields)
          .from('customer_billing_rates AS cbr')
          .where('cbr.project_id', 'IS', null)
          .andWhere('cbr.customer_id', 'IS', null)
          .andWhere('cbr.sla_type_id', 'IS NOT',null)
          .leftJoin('customers', 'customers.id', 'cbr.customer_id')
          .leftJoin('sla_types', 'cbr.sla_type_id', 'sla_types.id')
          .orderBy('cbr.customer_id');
    }
    if (params.view === 'customer'){
      sql = db.select(customerFields)
          .from('customer_billing_rates AS cbr')
          .where('cbr.project_id', 'IS', null)
          .andWhere('cbr.customer_id', 'IS NOT', null)
          .andWhere('cbr.sla_type_id', 'IS NOT',null)
          .leftJoin('customers', 'customers.id', 'cbr.customer_id')
          .leftJoin('sla_types', 'cbr.sla_type_id', 'sla_types.id')
          .orderBy('cbr.customer_id');
    }
    if (params.view === 'project'){
      sql = db.select(projectFields)
          .from('customer_billing_rates AS cbr')
          .where('cbr.project_id', 'IS NOT', null)
          .andWhere('cbr.customer_id', 'IS NOT', null)
          .andWhere('cbr.sla_type_id', 'IS NOT',null)
          .leftJoin('customers', 'customers.id', 'cbr.customer_id')
          .leftJoin('sla_types', 'cbr.sla_type_id', 'sla_types.id')
          .leftJoin('projects', 'projects.id', 'cbr.project_id')
          .orderBy('cbr.customer_id');
    }

    if (params.customer_id){
      sql.andWhere('cbr.customer_id', '=', params.customer_id);
    }
    if (params.project_id) {
      sql.andWhere('cbr.project_id', '=', params.project_id);
    }
    return knexnest(sql).then(data => plainToClass(CustomerBillingRatesDto, data));
  }

  async createNewCustomerBillingRate(cbrId: string, newCBR: CustomerBillingRatesDto): Promise<CustomerBillingRatesDto> {
    const db = await this.databaseService.getConnection();
    return db.transaction(async trx => {
      return trx('customer_billing_rates').insert({
        'id': cbrId,
        'customer_id': newCBR.customerId,
        'project_id': newCBR.projectId,
        'sla_type_id': newCBR.slaId,
        'fixed_hourly_rate': newCBR.fixedHourlyRate,
        'fixed_hours': newCBR.fixedHours,
        'additional_hourly_rate': newCBR.additionalHours,
        'additional_hours': newCBR.additionalHours,
      }).returning('*')
    });
  }

  async updateCustomerBillingRate(cbrId: string, updatedCBR: CustomerBillingRatesDto): Promise<CustomerBillingRatesDto> {
    const db = await this.databaseService.getConnection();
    return db('customer_billing_rates')
        .where('id', cbrId)
        .update({
          'fixed_hourly_rate': updatedCBR.fixedHourlyRate,
          'fixed_hours': updatedCBR.fixedHours,
          'additional_hourly_rate': updatedCBR.additionalHourlyRate,
          'additional_hours': updatedCBR.additionalHours,
          'sla_type_id': updatedCBR.slaId,
        }).returning('*');
  }

  async deleteCustomerBillingRateById(projectId: string) {
    const db = await this.databaseService.getConnection();
    return db.transaction(async trx => {
      return trx.from('customer_billing_rates').where('project_id', projectId).del();
    });
  }

  async getAppropriateBillingRate(customerId: number, projectId: number, slaId: number): Promise<CustomerBillingRatesDto> {
    const db = await this.databaseService.getConnection();

    //@note: format of possible combination string customerId-projectId-slaId
    const possibleCombinations = [
      // '0-0-0',
      '0-0-:slaId',
      // ':customerId-0-0',
      // ':customerId-:projectId-0',
      ':customerId-0-:slaId',
      ':customerId-:projectId-:slaId',
    ].map(o => (o.replace(':customerId', ((!isNaN(+customerId) ? +customerId : 0)).toString()).replace(':projectId', ((!isNaN(+projectId) ? +projectId : 0)).toString()).replace(':slaId', (!isNaN(+slaId) ? +slaId : 0).toString())));

    return db.withSchema('public').select([
      'id AS id', 'customer_id AS customerId', 'project_id AS projectId', 'sla_type_id AS slaId', 'fixed_hourly_rate AS fixedHourlyRate', 'fixed_hours AS fixedHours',
      'customer_billing_rounding_rule_id AS customerBillingRoundingRuleId', 'labor_hourly_bill_rate AS laborHourlyBillRate', 'labor_minimum_charge AS laborMinimumCharge',
      'labor_maximum_charge AS laborMaximumCharge', 'travel_markup_rate AS travelMarkupRate', 'freight_markup_rate AS freightMarkupRate', 'part_markup_rate AS partMarkupRate',
      'fixed_hourly_rate AS fixedHourlyRate', 'fixed_hours AS fixedHours',
      'additional_hourly_rate AS additionalHourlyRate', 'additional_hours AS additionalHours', 'billing_rounding_rule AS roundingRule', 'billing_rounding_mode AS roundingMode',
      'netsuite_item_id AS _netsuiteItemId', 'netsuite_item_name AS _netsuiteItemName'
    ]).from('customer_billing_rates')
        .whereIn(db.raw(`concat(COALESCE(customer_id, 0), '-', COALESCE(project_id, 0), '-', COALESCE(sla_type_id, 0))`), possibleCombinations)
        .orderByRaw(`concat(COALESCE(customer_id, 0), '-', COALESCE(project_id, 0), '-', COALESCE(sla_type_id, 0)) DESC`)
        .limit(1).first().then(data => plainToClass(CustomerBillingRatesDto, data));
  }
}
