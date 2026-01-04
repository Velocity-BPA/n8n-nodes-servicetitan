/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { LICENSING_NOTICE } from '../constants/constants';

interface TokenCache {
	accessToken: string;
	expiresAt: number;
}

const tokenCache: Map<string, TokenCache> = new Map();
let licensingNoticeLogged = false;

/**
 * Logs the licensing notice once per node load
 */
function logLicensingNotice(): void {
	if (!licensingNoticeLogged) {
		console.warn(LICENSING_NOTICE);
		licensingNoticeLogged = true;
	}
}

/**
 * Get or refresh OAuth access token
 */
async function getAccessToken(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('serviceTitanApi');
	
	const clientId = credentials.clientId as string;
	const clientSecret = credentials.clientSecret as string;
	const authHost = (credentials.authHost as string) || 'auth.servicetitan.io';
	
	const cacheKey = `${clientId}:${credentials.tenantId}`;
	const cached = tokenCache.get(cacheKey);
	
	// Return cached token if still valid (with 5 minute buffer)
	if (cached && cached.expiresAt > Date.now() + 300000) {
		return cached.accessToken;
	}
	
	const tokenUrl = `https://${authHost}/connect/token`;
	
	const response = await this.helpers.httpRequest({
		method: 'POST',
		url: tokenUrl,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`,
	});
	
	if (!response.access_token) {
		throw new NodeOperationError(
			this.getNode(),
			'Failed to obtain access token from ServiceTitan',
		);
	}
	
	// Cache the token
	tokenCache.set(cacheKey, {
		accessToken: response.access_token,
		expiresAt: Date.now() + (response.expires_in * 1000),
	});
	
	return response.access_token;
}

/**
 * Build the base URL for API requests
 */
function getBaseUrl(apiHost: string): string {
	return `https://${apiHost}`;
}

/**
 * Replace tenant placeholder in path
 */
function resolvePath(path: string, tenantId: string): string {
	return path.replace('{tenant}', tenantId);
}

export interface ServiceTitanRequestOptions {
	method: IHttpRequestMethods;
	endpoint: string;
	body?: IDataObject;
	qs?: IDataObject;
}

/**
 * Make an authenticated request to ServiceTitan API
 */
export async function serviceTitanApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	options: ServiceTitanRequestOptions,
): Promise<IDataObject | IDataObject[]> {
	logLicensingNotice();
	
	const credentials = await this.getCredentials('serviceTitanApi');
	const apiHost = (credentials.apiHost as string) || 'api.servicetitan.io';
	const tenantId = credentials.tenantId as string;
	const clientId = credentials.clientId as string;
	
	const accessToken = await getAccessToken.call(this);
	
	const resolvedEndpoint = resolvePath(options.endpoint, tenantId);
	
	const requestOptions: IHttpRequestOptions = {
		method: options.method,
		url: `${getBaseUrl(apiHost)}/${resolvedEndpoint}`,
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'ST-App-Key': clientId,
			'Content-Type': 'application/json',
		},
		json: true,
	};
	
	if (options.body && Object.keys(options.body).length > 0) {
		requestOptions.body = options.body;
	}
	
	if (options.qs && Object.keys(options.qs).length > 0) {
		requestOptions.qs = options.qs;
	}
	
	try {
		const response = await this.helpers.httpRequest(requestOptions);
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: `ServiceTitan API request failed: ${(error as Error).message}`,
		});
	}
}

/**
 * Make a paginated request to ServiceTitan API
 */
export async function serviceTitanApiRequestAllItems(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	options: ServiceTitanRequestOptions,
	propertyName: string = 'data',
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let page = 1;
	const pageSize = 100;
	
	const qs = options.qs || {};
	qs.pageSize = pageSize;
	
	do {
		qs.page = page;
		
		const response = await serviceTitanApiRequest.call(this, {
			...options,
			qs,
		}) as IDataObject;
		
		const items = (response[propertyName] as IDataObject[]) || [];
		returnData.push(...items);
		
		// Check if we've reached the limit
		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
		
		// Check if there are more pages
		const hasMore = response.hasMore as boolean;
		if (!hasMore || items.length < pageSize) {
			break;
		}
		
		page++;
	} while (true);
	
	return returnData;
}

/**
 * Validate required parameters
 */
export function validateRequiredParams(
	node: IExecuteFunctions,
	params: Record<string, unknown>,
	requiredFields: string[],
): void {
	for (const field of requiredFields) {
		if (params[field] === undefined || params[field] === null || params[field] === '') {
			throw new NodeOperationError(
				node.getNode(),
				`Required parameter "${field}" is missing`,
			);
		}
	}
}

/**
 * Format date for ServiceTitan API
 */
export function formatDate(date: string | Date): string {
	if (typeof date === 'string') {
		return date;
	}
	return date.toISOString();
}

/**
 * Parse ServiceTitan error response
 */
export function parseServiceTitanError(error: unknown): string {
	if (error instanceof Error) {
		const errorObj = error as Error & { response?: { body?: { message?: string; errors?: string[] } } };
		if (errorObj.response?.body?.message) {
			return errorObj.response.body.message;
		}
		if (errorObj.response?.body?.errors) {
			return errorObj.response.body.errors.join(', ');
		}
		return error.message;
	}
	return 'Unknown error occurred';
}
