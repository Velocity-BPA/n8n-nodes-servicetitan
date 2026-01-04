/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	simplifyOutput,
	cleanObject,
	parseId,
	formatPhoneNumber,
	formatAddress,
	validateEmail,
	validateRequired,
	centsToDollars,
	dollarsToCents,
	parseDate,
	getStatusCode,
	buildQueryString,
	toExecutionData,
} from '../../nodes/ServiceTitan/utils/helpers';

describe('ServiceTitan Helpers', () => {
	describe('simplifyOutput', () => {
		it('should return array for single object', () => {
			const input = { id: 1, name: 'Test' };
			const result = simplifyOutput(input);
			expect(result).toEqual([{ id: 1, name: 'Test' }]);
		});

		it('should return array as-is', () => {
			const input = [{ id: 1 }, { id: 2 }];
			const result = simplifyOutput(input);
			expect(result).toEqual([{ id: 1 }, { id: 2 }]);
		});
	});

	describe('toExecutionData', () => {
		it('should convert data to execution format', () => {
			const input = [{ id: 1 }, { id: 2 }];
			const result = toExecutionData(input);
			expect(result).toEqual([{ json: { id: 1 } }, { json: { id: 2 } }]);
		});
	});

	describe('cleanObject', () => {
		it('should remove undefined and null values', () => {
			const input = { a: 1, b: undefined, c: null, d: 'test' };
			const result = cleanObject(input);
			expect(result).toEqual({ a: 1, d: 'test' });
		});

		it('should remove empty strings', () => {
			const input = { a: '', b: 'test' };
			const result = cleanObject(input);
			expect(result).toEqual({ b: 'test' });
		});

		it('should handle nested objects', () => {
			const input = { a: 1, nested: { b: 2, c: undefined } };
			const result = cleanObject(input);
			expect(result).toEqual({ a: 1, nested: { b: 2 } });
		});
	});

	describe('parseId', () => {
		it('should parse string ID to number', () => {
			expect(parseId('123')).toBe(123);
		});

		it('should return number ID as is', () => {
			expect(parseId(456)).toBe(456);
		});

		it('should return NaN for invalid ID', () => {
			expect(parseId('abc')).toBeNaN();
		});
	});

	describe('formatPhoneNumber', () => {
		it('should format 10-digit phone number', () => {
			expect(formatPhoneNumber('1234567890')).toBe('+11234567890');
		});

		it('should handle phone number with country code', () => {
			expect(formatPhoneNumber('11234567890')).toBe('+11234567890');
		});

		it('should add country code prefix', () => {
			expect(formatPhoneNumber('5551234567')).toBe('+15551234567');
		});
	});

	describe('formatAddress', () => {
		it('should format complete address', () => {
			const address = {
				street: '123 Main St',
				city: 'Anytown',
				state: 'CA',
				zip: '12345',
			};
			const result = formatAddress(address);
			expect(result.street).toBe('123 Main St');
			expect(result.city).toBe('Anytown');
			expect(result.state).toBe('CA');
			expect(result.zip).toBe('12345');
			expect(result.country).toBe('US');
		});

		it('should handle missing fields with defaults', () => {
			const address = { street: '123 Main St' };
			const result = formatAddress(address);
			expect(result.street).toBe('123 Main St');
			expect(result.city).toBe('');
		});
	});

	describe('validateEmail', () => {
		it('should return true for valid email', () => {
			expect(validateEmail('test@example.com')).toBe(true);
		});

		it('should return false for invalid email', () => {
			expect(validateEmail('invalid-email')).toBe(false);
		});

		it('should return false for empty string', () => {
			expect(validateEmail('')).toBe(false);
		});
	});

	describe('validateRequired', () => {
		it('should return empty array for valid data', () => {
			const data = { name: 'Test', email: 'test@test.com' };
			const result = validateRequired(data, ['name', 'email']);
			expect(result).toEqual([]);
		});

		it('should return missing fields', () => {
			const data = { name: 'Test' };
			const result = validateRequired(data, ['name', 'email']);
			expect(result).toEqual(['email']);
		});

		it('should treat empty string as missing', () => {
			const data = { name: '', email: 'test@test.com' };
			const result = validateRequired(data, ['name', 'email']);
			expect(result).toEqual(['name']);
		});
	});

	describe('centsToDollars', () => {
		it('should convert cents to dollars', () => {
			expect(centsToDollars(1050)).toBe(10.5);
		});

		it('should handle zero', () => {
			expect(centsToDollars(0)).toBe(0);
		});
	});

	describe('dollarsToCents', () => {
		it('should convert dollars to cents', () => {
			expect(dollarsToCents(10.5)).toBe(1050);
		});

		it('should round properly', () => {
			expect(dollarsToCents(10.555)).toBe(1056);
		});
	});

	describe('parseDate', () => {
		it('should parse date string to ISO', () => {
			const result = parseDate('2024-01-15');
			expect(result).toContain('2024-01-15');
		});

		it('should throw for invalid date', () => {
			expect(() => parseDate('invalid')).toThrow('Invalid date');
		});
	});

	describe('getStatusCode', () => {
		it('should return code for known status', () => {
			expect(getStatusCode('job', 'pending')).toBe(1);
			expect(getStatusCode('job', 'completed')).toBe(4);
		});

		it('should return undefined for unknown status', () => {
			expect(getStatusCode('job', 'unknown')).toBeUndefined();
		});

		it('should return undefined for unknown resource', () => {
			expect(getStatusCode('unknown', 'pending')).toBeUndefined();
		});
	});

	describe('buildQueryString', () => {
		it('should build query object from params', () => {
			const params = { page: 1, pageSize: 20, active: true };
			const result = buildQueryString(params);
			expect(result).toEqual({ page: 1, pageSize: 20, active: true });
		});

		it('should handle empty params', () => {
			expect(buildQueryString({})).toEqual({});
		});

		it('should skip undefined and null values', () => {
			const params = { page: 1, filter: undefined, search: null };
			const result = buildQueryString(params);
			expect(result).toEqual({ page: 1 });
		});

		it('should join array values', () => {
			const params = { ids: [1, 2, 3] };
			const result = buildQueryString(params);
			expect(result).toEqual({ ids: '1,2,3' });
		});
	});
});
