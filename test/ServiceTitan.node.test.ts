/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ServiceTitan } from '../nodes/ServiceTitan/ServiceTitan.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('ServiceTitan Node', () => {
  let node: ServiceTitan;

  beforeAll(() => {
    node = new ServiceTitan();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('ServiceTitan');
      expect(node.description.name).toBe('servicetitan');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Customer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        appKey: 'test-key',
        baseUrl: 'https://api.servicetitan.io',
        tenantId: 'test-tenant'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  test('getCustomers operation success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCustomers')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce('');

    const mockResponse = { data: [{ id: '1', name: 'Test Customer' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.servicetitan.io/crm/v2/test-tenant/customers',
      headers: {
        Authorization: 'Bearer test-token',
        'ST-App-Key': 'test-key',
      },
      qs: { page: 1, pageSize: 50, active: true },
      json: true,
    });
  });

  test('getCustomer operation success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCustomer')
      .mockReturnValueOnce('123');

    const mockResponse = { id: '123', name: 'Test Customer' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.servicetitan.io/crm/v2/test-tenant/customers/123',
      headers: {
        Authorization: 'Bearer test-token',
        'ST-App-Key': 'test-key',
      },
      json: true,
    });
  });

  test('createCustomer operation success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCustomer')
      .mockReturnValueOnce('New Customer')
      .mockReturnValueOnce('Residential')
      .mockReturnValueOnce({ addressFields: { street: '123 Main St', city: 'Test City' } })
      .mockReturnValueOnce({ contactsFields: [{ name: 'John', type: 'Phone', value: '555-0123' }] });

    const mockResponse = { id: '456', name: 'New Customer' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.servicetitan.io/crm/v2/test-tenant/customers',
      headers: {
        Authorization: 'Bearer test-token',
        'ST-App-Key': 'test-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'New Customer',
        type: 'Residential',
        address: { street: '123 Main St', city: 'Test City' },
        contacts: [{ name: 'John', type: 'Phone', value: '555-0123' }],
      },
      json: true,
    });
  });

  test('error handling', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCustomers');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  test('unknown operation throws error', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('invalidOperation');

    await expect(
      executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: invalidOperation');
  });
});

describe('Job Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        appKey: 'test-app-key',
        baseUrl: 'https://api.servicetitan.io',
        tenantId: 'test-tenant',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  test('should get jobs successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getJobs')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      data: [{ id: 1, summary: 'Test Job' }],
      totalCount: 1,
    });

    const result = await executeJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: { data: [{ id: 1, summary: 'Test Job' }], totalCount: 1 },
        pairedItem: { item: 0 },
      },
    ]);
  });

  test('should get single job successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getJob')
      .mockReturnValueOnce('123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 123,
      summary: 'Test Job',
      customerId: 456,
    });

    const result = await executeJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: { id: 123, summary: 'Test Job', customerId: 456 },
        pairedItem: { item: 0 },
      },
    ]);
  });

  test('should create job successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createJob')
      .mockReturnValueOnce(456)
      .mockReturnValueOnce(789)
      .mockReturnValueOnce('High')
      .mockReturnValueOnce('New test job');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 123,
      customerId: 456,
      jobTypeId: 789,
      priority: 'High',
      summary: 'New test job',
    });

    const result = await executeJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: {
          id: 123,
          customerId: 456,
          jobTypeId: 789,
          priority: 'High',
          summary: 'New test job',
        },
        pairedItem: { item: 0 },
      },
    ]);
  });

  test('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getJob').mockReturnValueOnce('123');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Job not found'));

    const result = await executeJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: { error: 'Job not found' },
        pairedItem: { item: 0 },
      },
    ]);
  });

  test('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getJob').mockReturnValueOnce('123');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Job not found'));

    await expect(executeJobOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow(
      'Job not found',
    );
  });

  test('should get job appointments successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getJobAppointments')
      .mockReturnValueOnce('123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      data: [{ id: 1, jobId: 123, start: '2023-01-01T10:00:00Z' }],
    });

    const result = await executeJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: { data: [{ id: 1, jobId: 123, start: '2023-01-01T10:00:00Z' }] },
        pairedItem: { item: 0 },
      },
    ]);
  });

  test('should get job history successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getJobHistory')
      .mockReturnValueOnce('123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      data: [{ id: 1, jobId: 123, action: 'Created', timestamp: '2023-01-01T10:00:00Z' }],
    });

    const result = await executeJobOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: { data: [{ id: 1, jobId: 123, action: 'Created', timestamp: '2023-01-01T10:00:00Z' }] },
        pairedItem: { item: 0 },
      },
    ]);
  });
});

describe('Appointment Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.servicetitan.io',
				tenantId: 'test-tenant',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getAppointments', () => {
		it('should retrieve appointments successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAppointments')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(50)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			const mockResponse = { data: [{ id: '1', jobId: 'job1' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAppointmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.servicetitan.io/jpm/v2/test-tenant/appointments?page=1&pageSize=50',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('createAppointment', () => {
		it('should create appointment successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createAppointment')
				.mockReturnValueOnce('job123')
				.mockReturnValueOnce('2023-12-01T10:00:00Z')
				.mockReturnValueOnce('2023-12-01T12:00:00Z')
				.mockReturnValueOnce('tech123');

			const mockResponse = { id: 'app123', jobId: 'job123' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAppointmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('error handling', () => {
		it('should handle errors when continueOnFail is true', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAppointments');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			const result = await executeAppointmentOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Technician Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        clientId: 'test-client-id',
        baseUrl: 'https://api.servicetitan.io'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getTechnicians', () => {
    it('should retrieve all technicians successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTechnicians')
        .mockReturnValueOnce('tenant123')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(true);

      const mockResponse = { data: [{ id: '1', name: 'John Doe' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTechnicianOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.servicetitan.io/settings/v2/tenant123/technicians',
        headers: {
          'Authorization': 'Bearer test-token',
          'ST-App-Key': 'test-client-id',
          'Content-Type': 'application/json',
        },
        qs: { page: 1, pageSize: 50, active: true },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors when retrieving technicians', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTechnicians')
        .mockReturnValueOnce('tenant123');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTechnicianOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTechnician', () => {
    it('should retrieve specific technician successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTechnician')
        .mockReturnValueOnce('tenant123')
        .mockReturnValueOnce('tech123');

      const mockResponse = { id: 'tech123', name: 'John Doe' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTechnicianOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.servicetitan.io/settings/v2/tenant123/technicians/tech123',
        headers: {
          'Authorization': 'Bearer test-token',
          'ST-App-Key': 'test-client-id',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('createTechnician', () => {
    it('should create technician successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createTechnician')
        .mockReturnValueOnce('tenant123')
        .mockReturnValueOnce('John Doe')
        .mockReturnValueOnce('john@example.com')
        .mockReturnValueOnce('EMP123');

      const mockResponse = { id: 'tech123', name: 'John Doe' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTechnicianOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.servicetitan.io/settings/v2/tenant123/technicians',
        headers: {
          'Authorization': 'Bearer test-token',
          'ST-App-Key': 'test-client-id',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          employeeId: 'EMP123',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateTechnician', () => {
    it('should update technician successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateTechnician')
        .mockReturnValueOnce('tenant123')
        .mockReturnValueOnce('tech123')
        .mockReturnValueOnce('John Updated')
        .mockReturnValueOnce('john.updated@example.com')
        .mockReturnValueOnce(false);

      const mockResponse = { id: 'tech123', name: 'John Updated' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTechnicianOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.servicetitan.io/settings/v2/tenant123/technicians/tech123',
        headers: {
          'Authorization': 'Bearer test-token',
          'ST-App-Key': 'test-client-id',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'John Updated',
          email: 'john.updated@example.com',
          active: false,
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTechnicianSchedule', () => {
    it('should retrieve technician schedule successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTechnicianSchedule')
        .mockReturnValueOnce('tenant123')
        .mockReturnValueOnce('tech123')
        .mockReturnValueOnce('2023-01-01T00:00:00Z')
        .mockReturnValueOnce('2023-01-31T23:59:59Z');

      const mockResponse = { schedule: [] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTechnicianOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.servicetitan.io/dispatch/v2/tenant123/technicians/tech123/schedule',
        headers: {
          'Authorization': 'Bearer test-token',
          'ST-App-Key': 'test-client-id',
          'Content-Type': 'application/json',
        },
        qs: {
          startsOnOrAfter: '2023-01-01T00:00:00Z',
          startsOnOrBefore: '2023-01-31T23:59:59Z',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTechnicianAvailability', () => {
    it('should retrieve technician availability successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTechnicianAvailability')
        .mockReturnValueOnce('tenant123')
        .mockReturnValueOnce('tech123')
        .mockReturnValueOnce('2023-01-15T00:00:00Z');

      const mockResponse = { available: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTechnicianOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.servicetitan.io/dispatch/v2/tenant123/technicians/tech123/availability',
        headers: {
          'Authorization': 'Bearer test-token',
          'ST-App-Key': 'test-client-id',
          'Content-Type': 'application/json',
        },
        qs: {
          date: '2023-01-15T00:00:00Z',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Location Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token',
        clientId: 'test-client-id',
        baseUrl: 'https://api.servicetitan.io',
        tenantId: 'test-tenant'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get all locations successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getLocations')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce('123');

    const mockResponse = { data: [{ id: 1, name: 'Test Location' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/locations?page=1&pageSize=50&customerId=123')
      })
    );
  });

  it('should get location by ID successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getLocation')
      .mockReturnValueOnce('123');

    const mockResponse = { id: 123, name: 'Test Location' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/locations/123')
      })
    );
  });

  it('should create location successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createLocation')
      .mockReturnValueOnce('456')
      .mockReturnValueOnce('New Location')
      .mockReturnValueOnce({ addressFields: { street: '123 Main St', city: 'Test City' } });

    const mockResponse = { id: 789, name: 'New Location' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          customerId: 456,
          name: 'New Location'
        })
      })
    );
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getLocation').mockReturnValueOnce('123');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Estimate Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.servicetitan.io',
        tenantId: 'test-tenant',
        clientId: 'test-client-id'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn() },
    };
  });

  it('should get all estimates successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEstimates')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      data: [{ id: '1', name: 'Test Estimate' }],
      totalCount: 1
    });

    const result = await executeEstimateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data).toEqual([{ id: '1', name: 'Test Estimate' }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.servicetitan.io/sales/v2/test-tenant/estimates?page=1&pageSize=50',
      headers: {
        'Authorization': 'Bearer test-token',
        'ST-App-Key': 'test-client-id',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get estimate by ID successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEstimate')
      .mockReturnValueOnce('123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: '123',
      name: 'Test Estimate'
    });

    const result = await executeEstimateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.servicetitan.io/sales/v2/test-tenant/estimates/123',
      headers: {
        'Authorization': 'Bearer test-token',
        'ST-App-Key': 'test-client-id',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should create estimate successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createEstimate')
      .mockReturnValueOnce('job-123')
      .mockReturnValueOnce('Test Estimate')
      .mockReturnValueOnce('Test Summary');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: '123',
      jobId: 'job-123',
      name: 'Test Estimate'
    });

    const result = await executeEstimateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.servicetitan.io/sales/v2/test-tenant/estimates',
      headers: {
        'Authorization': 'Bearer test-token',
        'ST-App-Key': 'test-client-id',
        'Content-Type': 'application/json',
      },
      body: {
        jobId: 'job-123',
        name: 'Test Estimate',
        summary: 'Test Summary'
      },
      json: true,
    });
  });

  it('should update estimate successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateEstimate')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('Updated Estimate')
      .mockReturnValueOnce('Updated Summary')
      .mockReturnValueOnce('active');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: '123',
      name: 'Updated Estimate'
    });

    const result = await executeEstimateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.name).toBe('Updated Estimate');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: 'https://api.servicetitan.io/sales/v2/test-tenant/estimates/123',
      headers: {
        'Authorization': 'Bearer test-token',
        'ST-App-Key': 'test-client-id',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Updated Estimate',
        summary: 'Updated Summary',
        status: 'active'
      },
      json: true,
    });
  });

  it('should delete estimate successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteEstimate')
      .mockReturnValueOnce('123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

    const result = await executeEstimateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.servicetitan.io/sales/v2/test-tenant/estimates/123',
      headers: {
        'Authorization': 'Bearer test-token',
        'ST-App-Key': 'test-client-id',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should convert estimate successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('convertEstimate')
      .mockReturnValueOnce('123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jobId: 'job-456',
      estimateId: '123'
    });

    const result = await executeEstimateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.jobId).toBe('job-456');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.servicetitan.io/sales/v2/test-tenant/estimates/123/convert',
      headers: {
        'Authorization': 'Bearer test-token',
        'ST-App-Key': 'test-client-id',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEstimate');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeEstimateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEstimate');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeEstimateOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});
});
