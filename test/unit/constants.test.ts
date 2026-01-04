/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	LICENSING_NOTICE,
	RESOURCES,
	API_PATHS,
	API_VERSION,
	CUSTOMER_OPERATIONS,
	JOB_OPERATIONS,
	APPOINTMENT_OPERATIONS,
	INVOICE_OPERATIONS,
	TECHNICIAN_OPERATIONS,
} from '../../nodes/ServiceTitan/constants/constants';

describe('ServiceTitan Constants', () => {
	describe('LICENSING_NOTICE', () => {
		it('should contain Velocity BPA', () => {
			expect(LICENSING_NOTICE).toContain('Velocity BPA');
		});

		it('should contain BSL 1.1 reference', () => {
			expect(LICENSING_NOTICE).toContain('Business Source License 1.1');
		});

		it('should contain contact information', () => {
			expect(LICENSING_NOTICE).toContain('velobpa.com');
		});
	});

	describe('RESOURCES', () => {
		it('should have 17 resources', () => {
			expect(RESOURCES.length).toBe(17);
		});

		it('should include core resources', () => {
			const resourceValues = RESOURCES.map((r) => r.value);
			expect(resourceValues).toContain('customer');
			expect(resourceValues).toContain('job');
			expect(resourceValues).toContain('appointment');
			expect(resourceValues).toContain('invoice');
			expect(resourceValues).toContain('technician');
		});

		it('should have name and value for each resource', () => {
			RESOURCES.forEach((resource) => {
				expect(resource).toHaveProperty('name');
				expect(resource).toHaveProperty('value');
			});
		});
	});

	describe('API_PATHS', () => {
		it('should have paths for core resources', () => {
			expect(API_PATHS).toHaveProperty('customers');
			expect(API_PATHS).toHaveProperty('jobs');
			expect(API_PATHS).toHaveProperty('invoices');
			expect(API_PATHS).toHaveProperty('technicians');
		});

		it('should have correct path format with tenant placeholder', () => {
			expect(API_PATHS.customers).toContain('{tenant}');
			expect(API_PATHS.jobs).toContain('{tenant}');
		});

		it('should include v2 API version in paths', () => {
			expect(API_PATHS.customers).toContain('v2');
		});
	});

	describe('API_VERSION', () => {
		it('should be v2', () => {
			expect(API_VERSION).toBe('v2');
		});
	});

	describe('Operations', () => {
		it('should have customer operations', () => {
			expect(CUSTOMER_OPERATIONS.length).toBeGreaterThan(0);
			const ops = CUSTOMER_OPERATIONS.map((o) => o.value);
			expect(ops).toContain('listCustomers');
			expect(ops).toContain('getCustomer');
			expect(ops).toContain('createCustomer');
		});

		it('should have job operations', () => {
			expect(JOB_OPERATIONS.length).toBeGreaterThan(0);
			const ops = JOB_OPERATIONS.map((o) => o.value);
			expect(ops).toContain('listJobs');
			expect(ops).toContain('getJob');
			expect(ops).toContain('createJob');
		});

		it('should have appointment operations', () => {
			expect(APPOINTMENT_OPERATIONS.length).toBeGreaterThan(0);
			const ops = APPOINTMENT_OPERATIONS.map((o) => o.value);
			expect(ops).toContain('listAppointments');
			expect(ops).toContain('createAppointment');
		});

		it('should have invoice operations', () => {
			expect(INVOICE_OPERATIONS.length).toBeGreaterThan(0);
			const ops = INVOICE_OPERATIONS.map((o) => o.value);
			expect(ops).toContain('listInvoices');
			expect(ops).toContain('getInvoice');
		});

		it('should have technician operations', () => {
			expect(TECHNICIAN_OPERATIONS.length).toBeGreaterThan(0);
			const ops = TECHNICIAN_OPERATIONS.map((o) => o.value);
			expect(ops).toContain('listTechnicians');
			expect(ops).toContain('getTechnician');
		});
	});
});
