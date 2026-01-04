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

export async function listMemberships(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.memberships, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.memberships,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getMembership(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const membershipId = this.getNodeParameter('membershipId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.memberships}/${membershipId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createMembership(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const customerId = this.getNodeParameter('customerId', index) as string;
	const locationId = this.getNodeParameter('locationId', index) as string;
	const membershipTypeId = this.getNodeParameter('membershipTypeId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		customerId: parseInt(customerId, 10),
		locationId: parseInt(locationId, 10),
		membershipTypeId: parseInt(membershipTypeId, 10),
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.memberships,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateMembership(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const membershipId = this.getNodeParameter('membershipId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.memberships}/${membershipId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function cancelMembership(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const membershipId = this.getNodeParameter('membershipId', index) as string;
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
		endpoint: `${API_PATHS.memberships}/${membershipId}/cancel`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getMembershipLocations(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const membershipId = this.getNodeParameter('membershipId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.memberships}/${membershipId}/locations`,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}
