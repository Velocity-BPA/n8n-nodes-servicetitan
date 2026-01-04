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

export async function listLeads(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.leads, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.leads,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getLead(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const leadId = this.getNodeParameter('leadId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.leads}/${leadId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createLead(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const phone = this.getNodeParameter('phone', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		name,
		contacts: [
			{
				type: 'Phone',
				value: phone,
			},
		],
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.leads,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateLead(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const leadId = this.getNodeParameter('leadId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.leads}/${leadId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function convertLead(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const leadId = this.getNodeParameter('leadId', index) as string;
	const jobTypeId = this.getNodeParameter('jobTypeId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		jobTypeId: parseInt(jobTypeId, 10),
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.leads}/${leadId}/convert`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function dismissLead(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const leadId = this.getNodeParameter('leadId', index) as string;
	const dismissReasonId = this.getNodeParameter('dismissReasonId', index, null) as string | null;
	const memo = this.getNodeParameter('memo', index, '') as string;
	
	const body: IDataObject = {};
	
	if (dismissReasonId) {
		body.dismissReasonId = parseInt(dismissReasonId, 10);
	}
	
	if (memo) {
		body.memo = memo;
	}
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.leads}/${leadId}/dismiss`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function addFollowUp(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const leadId = this.getNodeParameter('leadId', index) as string;
	const followUpDate = this.getNodeParameter('followUpDate', index) as string;
	const note = this.getNodeParameter('note', index, '') as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		followUpDate,
		note,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.leads}/${leadId}/follow-ups`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}
