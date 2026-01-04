/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Simplify the output data for n8n
 */
export function simplifyOutput(data: IDataObject | IDataObject[]): IDataObject[] {
	if (Array.isArray(data)) {
		return data;
	}
	return [data];
}

/**
 * Convert n8n execution data to output format
 */
export function toExecutionData(data: IDataObject[]): INodeExecutionData[] {
	return data.map((item) => ({
		json: item,
	}));
}

/**
 * Build query string from filter parameters
 */
export function buildQueryString(filters: IDataObject): IDataObject {
	const qs: IDataObject = {};
	
	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined && value !== null && value !== '') {
			// Handle date range filters
			if (key.endsWith('From') || key.endsWith('To')) {
				qs[key] = value;
			} else if (Array.isArray(value)) {
				qs[key] = value.join(',');
			} else {
				qs[key] = value;
			}
		}
	}
	
	return qs;
}

/**
 * Clean empty values from object
 */
export function cleanObject(obj: IDataObject): IDataObject {
	const cleaned: IDataObject = {};
	
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			if (typeof value === 'object' && !Array.isArray(value)) {
				const cleanedNested = cleanObject(value as IDataObject);
				if (Object.keys(cleanedNested).length > 0) {
					cleaned[key] = cleanedNested;
				}
			} else {
				cleaned[key] = value;
			}
		}
	}
	
	return cleaned;
}

/**
 * Parse ID from string or number
 */
export function parseId(id: string | number): number {
	if (typeof id === 'number') {
		return id;
	}
	return parseInt(id, 10);
}

/**
 * Format phone number for ServiceTitan
 */
export function formatPhoneNumber(phone: string): string {
	// Remove all non-numeric characters
	const cleaned = phone.replace(/\D/g, '');
	
	// Add country code if not present
	if (cleaned.length === 10) {
		return `+1${cleaned}`;
	}
	
	if (!cleaned.startsWith('1') && cleaned.length === 10) {
		return `+1${cleaned}`;
	}
	
	return `+${cleaned}`;
}

/**
 * Format address object for ServiceTitan
 */
export function formatAddress(address: IDataObject): IDataObject {
	return {
		street: address.street || '',
		unit: address.unit || null,
		city: address.city || '',
		state: address.state || '',
		zip: address.zip || '',
		country: address.country || 'US',
	};
}

/**
 * Parse date string to ISO format
 */
export function parseDate(dateString: string): string {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		throw new Error(`Invalid date: ${dateString}`);
	}
	return date.toISOString();
}

/**
 * Convert cents to dollars
 */
export function centsToDollars(cents: number): number {
	return cents / 100;
}

/**
 * Convert dollars to cents
 */
export function dollarsToCents(dollars: number): number {
	return Math.round(dollars * 100);
}

/**
 * Extract pagination info from response
 */
export function extractPaginationInfo(response: IDataObject): IDataObject {
	return {
		page: response.page || 1,
		pageSize: response.pageSize || 0,
		totalCount: response.totalCount || 0,
		hasMore: response.hasMore || false,
	};
}

/**
 * Build date range filter
 */
export function buildDateRangeFilter(
	startDate?: string,
	endDate?: string,
	fieldPrefix: string = 'createdOn',
): IDataObject {
	const filter: IDataObject = {};
	
	if (startDate) {
		filter[`${fieldPrefix}From`] = parseDate(startDate);
	}
	
	if (endDate) {
		filter[`${fieldPrefix}To`] = parseDate(endDate);
	}
	
	return filter;
}

/**
 * Map status strings to ServiceTitan status codes
 */
export const STATUS_MAP: Record<string, Record<string, number>> = {
	job: {
		pending: 1,
		scheduled: 2,
		inProgress: 3,
		completed: 4,
		canceled: 5,
	},
	appointment: {
		scheduled: 1,
		dispatched: 2,
		working: 3,
		done: 4,
		canceled: 5,
	},
	invoice: {
		draft: 1,
		posted: 2,
		paid: 3,
		voided: 4,
	},
	estimate: {
		draft: 1,
		sent: 2,
		approved: 3,
		declined: 4,
	},
};

/**
 * Get status code from status name
 */
export function getStatusCode(
	resource: string,
	statusName: string,
): number | undefined {
	return STATUS_MAP[resource]?.[statusName];
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate required fields
 */
export function validateRequired(
	data: IDataObject,
	requiredFields: string[],
): string[] {
	const missing: string[] = [];
	
	for (const field of requiredFields) {
		if (data[field] === undefined || data[field] === null || data[field] === '') {
			missing.push(field);
		}
	}
	
	return missing;
}
