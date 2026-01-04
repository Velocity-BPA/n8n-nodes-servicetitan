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

export async function listBookings(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.bookings, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.bookings,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getBooking(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bookingId = this.getNodeParameter('bookingId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.bookings}/${bookingId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createBooking(
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
		endpoint: API_PATHS.bookings,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function updateBooking(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bookingId = this.getNodeParameter('bookingId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	
	const body = cleanObject(updateFields);
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'PATCH',
		endpoint: `${API_PATHS.bookings}/${bookingId}`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function convertToJob(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bookingId = this.getNodeParameter('bookingId', index) as string;
	const jobTypeId = this.getNodeParameter('jobTypeId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		jobTypeId: parseInt(jobTypeId, 10),
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.bookings}/${bookingId}/convert`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function dismissBooking(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bookingId = this.getNodeParameter('bookingId', index) as string;
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
		endpoint: `${API_PATHS.bookings}/${bookingId}/dismiss`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}
