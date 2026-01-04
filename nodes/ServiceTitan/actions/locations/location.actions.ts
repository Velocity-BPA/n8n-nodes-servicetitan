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

export async function listLocations(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.locations, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.locations,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getLocation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const locationId = this.getNodeParameter('locationId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.locations}/${locationId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createLocation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	const street = this.getNodeParameter('street', index) as string;
	const city = this.getNodeParameter('city', index) as string;
	const state = this.getNodeParameter('state', index) as string;
	const zip = this.getNodeParameter('zip', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		customerId: parseInt(customerId, 10),
		address: {
			street,
			city,
			state,
			zip,
			country: additionalFields.country || 'US',
		},
		...cleanObject(additionalFields),
	};
	
	// Remove country from root if it was added there
	delete body.country;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.locations,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateLocation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const locationId = this.getNodeParameter('locationId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.locations}/${locationId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getLocationEquipment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const locationId = this.getNodeParameter('locationId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.locations}/${locationId}/equipment`,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getLocationHistory(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const locationId = this.getNodeParameter('locationId', index) as string;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString({
		...filters,
		locationId,
	});
	
	// Get jobs for this location as the service history
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.jobs,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}
