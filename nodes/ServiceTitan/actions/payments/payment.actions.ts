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

export async function listPayments(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.payments, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.payments,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getPayment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const paymentId = this.getNodeParameter('paymentId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.payments}/${paymentId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function createPayment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const invoiceId = this.getNodeParameter('invoiceId', index) as string;
	const amount = this.getNodeParameter('amount', index) as number;
	const paymentTypeId = this.getNodeParameter('paymentTypeId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		invoiceId: parseInt(invoiceId, 10),
		amount,
		paymentTypeId: parseInt(paymentTypeId, 10),
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: API_PATHS.payments,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function refundPayment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const paymentId = this.getNodeParameter('paymentId', index) as string;
	const amount = this.getNodeParameter('amount', index) as number;
	const reason = this.getNodeParameter('reason', index, '') as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const body: IDataObject = {
		amount,
		reason,
		...cleanObject(additionalFields),
	};
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.payments}/${paymentId}/refund`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function voidPayment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const paymentId = this.getNodeParameter('paymentId', index) as string;
	const reason = this.getNodeParameter('reason', index, '') as string;
	
	const body: IDataObject = {};
	
	if (reason) {
		body.reason = reason;
	}
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'POST',
		endpoint: `${API_PATHS.payments}/${paymentId}/void`,
		body,
	});
	
	return toExecutionData([response as IDataObject]);
}
