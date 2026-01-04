/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { serviceTitanApiRequest, serviceTitanApiRequestAllItems } from '../../transport/client';
import { API_PATHS } from '../../constants/constants';
import { buildQueryString, toExecutionData } from '../../utils/helpers';

export async function listCampaigns(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
	
	const qs = buildQueryString(filters);
	
	if (returnAll) {
		const data = await serviceTitanApiRequestAllItems.call(
			this,
			{ method: 'GET', endpoint: API_PATHS.campaigns, qs },
			'data',
		);
		return toExecutionData(data);
	}
	
	const limit = this.getNodeParameter('limit', index) as number;
	qs.pageSize = limit;
	qs.page = 1;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: API_PATHS.campaigns,
		qs,
	}) as IDataObject;
	
	const data = (response.data as IDataObject[]) || [];
	return toExecutionData(data);
}

export async function getCampaign(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', index) as string;
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.campaigns}/${campaignId}`,
	});
	
	return toExecutionData([response as IDataObject]);
}

export async function getCampaignMetrics(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const campaignId = this.getNodeParameter('campaignId', index) as string;
	const startDate = this.getNodeParameter('startDate', index, null) as string | null;
	const endDate = this.getNodeParameter('endDate', index, null) as string | null;
	
	const qs: IDataObject = {};
	
	if (startDate) {
		qs.startDate = startDate;
	}
	
	if (endDate) {
		qs.endDate = endDate;
	}
	
	const response = await serviceTitanApiRequest.call(this, {
		method: 'GET',
		endpoint: `${API_PATHS.campaigns}/${campaignId}/metrics`,
		qs,
	});
	
	return toExecutionData([response as IDataObject]);
}
