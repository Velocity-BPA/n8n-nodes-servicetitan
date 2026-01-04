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

export async function listCustomers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.customers, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.customers,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getCustomer(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.customers}/${customerId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createCustomer(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		name,
		...cleanObject(additionalFields),
	};
	
	// Handle address separately
	if (additionalFields.address) {
		body.address = additionalFields.address;
	}
	
	// Handle contacts separately
	if (additionalFields.contacts) {
		body.contacts = additionalFields.contacts;
	}
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.customers,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateCustomer(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.customers}/${customerId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getCustomerContacts(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.customers}/${customerId}/contacts`,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function addCustomerContact(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	const type = this.getNodeParameter('contactType', index) as string;
	const value = this.getNodeParameter('contactValue', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		type,
		value,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.customers}/${customerId}/contacts`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getCustomerLocations(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	
	const qs: IDataObject = {
		customerId,
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.locations,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getCustomerNotes(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.customers}/${customerId}/notes`,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function addCustomerNote(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	const text = this.getNodeParameter('noteText', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		text,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.customers}/${customerId}/notes`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getCustomerEquipment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	
	// Get locations first, then equipment for each location
	const locationsResponse = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.locations,
		qs: { customerId },
	}) as IDataObject;
	
	const locations = (locationsResponse.data as IDataObject[]) || [];
	const allEquipment: IDataObject[] = [];
	
	for (const location of locations) {
		const locationId = location.id as string;
		const equipmentResponse = await serviceTitanApiRequest.call(this, {
			method: 'GET',
			endpoint: `${API_PATHS.locations}/${locationId}/equipment`,
		}) as IDataObject;
		
		const equipment = (equipmentResponse.data as IDataObject[]) || [];
		allEquipment.push(...equipment.map((e) => ({ ...e, locationId })));
	}
	
	return toExecutionData(allEquipment);
}
