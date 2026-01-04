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

export async function listEstimates(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.estimates, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.estimates,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getEstimate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const estimateId = this.getNodeParameter('estimateId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.estimates}/${estimateId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createEstimate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		jobId: parseInt(jobId, 10),
		name,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.estimates,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateEstimate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const estimateId = this.getNodeParameter('estimateId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.estimates}/${estimateId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function approveEstimate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const estimateId = this.getNodeParameter('estimateId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body = cleanObject(additionalFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.estimates}/${estimateId}/approve`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function declineEstimate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const estimateId = this.getNodeParameter('estimateId', index) as string;
	const reason = this.getNodeParameter('reason', index, '') as string;
	
	const body: IDataObject = {};
	
	if (reason) {
		body.reason = reason;
	}
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.estimates}/${estimateId}/decline`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function convertToInvoice(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const estimateId = this.getNodeParameter('estimateId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body = cleanObject(additionalFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.estimates}/${estimateId}/convert-to-invoice`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function emailEstimate(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const estimateId = this.getNodeParameter('estimateId', index) as string;
	const email = this.getNodeParameter('email', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		email,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.estimates}/${estimateId}/email`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}
