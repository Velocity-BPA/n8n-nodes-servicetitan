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

export async function getDispatchBoard(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const date = this.getNodeParameter('date', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const qs: IDataObject = {
		date,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.dispatch}/board`,
		qs,
	}) as IDataObject;
	
	return toExecutionData([response]);
}

export async function getZones(
	this: IExecuteFunctions,
	_index: number,
): Promise<INodeExecutionData[]> {
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.zones,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getCapacity(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const date = this.getNodeParameter('date', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const qs: IDataObject = {
		date,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.dispatch}/capacity`,
		qs,
	}) as IDataObject;
	
	return toExecutionData([response]);
}

export async function optimizeRoutes(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const date = this.getNodeParameter('date', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		date,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.dispatch}/optimize`,
		body,
	}) as IDataObject;
	
	return toExecutionData([response]);
}
