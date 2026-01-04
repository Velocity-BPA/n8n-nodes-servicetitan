/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { serviceTitanApiRequest } from '../../transport/client';
import { API_PATHS } from '../../constants/constants';
import { cleanObject, toExecutionData } from '../../utils/helpers';

export async function getRevenueReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const startDate = this.getNodeParameter('startDate', index) as string;
	const endDate = this.getNodeParameter('endDate', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const qs: IDataObject = {
		startDate,
		endDate,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.reports}/revenue`,
		qs,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getTechnicianReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const startDate = this.getNodeParameter('startDate', index) as string;
	const endDate = this.getNodeParameter('endDate', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const qs: IDataObject = {
		startDate,
		endDate,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.reports}/technician-performance`,
		qs,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getCallReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const startDate = this.getNodeParameter('startDate', index) as string;
	const endDate = this.getNodeParameter('endDate', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const qs: IDataObject = {
		startDate,
		endDate,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.reports}/calls`,
		qs,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getConversionReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const startDate = this.getNodeParameter('startDate', index) as string;
	const endDate = this.getNodeParameter('endDate', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const qs: IDataObject = {
		startDate,
		endDate,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.reports}/conversions`,
		qs,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getCustomReport(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const reportId = this.getNodeParameter('reportId', index) as string;
	const parameters = this.getNodeParameter('parameters', index, {}) as IDataObject;
	
	const qs = cleanObject(parameters);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.reports}/${reportId}`,
		qs,
	});
	
	return toExecutionData([response as IDataObject]);
}
