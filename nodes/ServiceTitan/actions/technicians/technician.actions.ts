/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { serviceTitanApiRequest, serviceTitanApiRequestAllItems } from '../../transport/client';
import { API_PATHS } from '../../constants/constants';
import { cleanObject, buildQueryString, toExecutionData } from '../../utils/helpers';

export async function listTechnicians(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.technicians, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.technicians,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getTechnician(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const technicianId = this.getNodeParameter('technicianId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.technicians}/${technicianId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createTechnician(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const firstName = this.getNodeParameter('firstName', index) as string;
	const lastName = this.getNodeParameter('lastName', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		name: `${firstName} ${lastName}`,
		firstName,
		lastName,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.technicians,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateTechnician(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const technicianId = this.getNodeParameter('technicianId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.technicians}/${technicianId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getTechnicianSchedule(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const technicianId = this.getNodeParameter('technicianId', index) as string;
	const startDate = this.getNodeParameter('startDate', index) as string;
	const endDate = this.getNodeParameter('endDate', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.appointments,
		qs: {
			technicianId,
			startsOnOrAfter: startDate,
			startsOnOrBefore: endDate,
		},
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getTechnicianCapacity(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const technicianId = this.getNodeParameter('technicianId', index) as string;
	const date = this.getNodeParameter('date', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.dispatch}/capacity`,
		qs: {
			technicianId,
			date,
		},
	}) as IDataObject;
	
	return toExecutionData([response]);
}

export async function getTechnicianPerformance(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const technicianId = this.getNodeParameter('technicianId', index) as string;
	const startDate = this.getNodeParameter('startDate', index) as string;
	const endDate = this.getNodeParameter('endDate', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.reports}/technician-performance`,
		qs: {
			technicianId,
			startDate,
			endDate,
		},
	}) as IDataObject;
	
	return toExecutionData([response]);
}
