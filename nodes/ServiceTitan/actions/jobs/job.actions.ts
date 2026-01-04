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

export async function listJobs(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.jobs, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.jobs,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getJob(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.jobs}/${jobId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createJob(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	const locationId = this.getNodeParameter('locationId', index) as string;
	const jobTypeId = this.getNodeParameter('jobTypeId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		customerId: parseInt(customerId, 10),
		locationId: parseInt(locationId, 10),
		jobTypeId: parseInt(jobTypeId, 10),
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.jobs,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateJob(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.jobs}/${jobId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function cancelJob(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	const cancelReasonId = this.getNodeParameter('cancelReasonId', index, null) as string | null;
	const memo = this.getNodeParameter('memo', index, '') as string;
	
	const body: IDataObject = {};
	
	if (cancelReasonId) {
		body.cancelReasonId = parseInt(cancelReasonId, 10);
	}
	
	if (memo) {
		body.memo = memo;
	}
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.jobs}/${jobId}/cancel`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function completeJob(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body = cleanObject(additionalFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.jobs}/${jobId}/complete`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getJobAppointments(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.appointments,
		qs: { jobId },
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getJobInvoices(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.invoices,
		qs: { jobId },
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getJobHistory(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.jobs}/${jobId}/history`,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getJobNotes(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.jobs}/${jobId}/notes`,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function addJobNote(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const jobId = this.getNodeParameter('jobId', index) as string;
	const text = this.getNodeParameter('noteText', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		text,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.jobs}/${jobId}/notes`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}
