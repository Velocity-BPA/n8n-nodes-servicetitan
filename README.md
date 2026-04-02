# n8n-nodes-servicetitan

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with ServiceTitan, the leading field service management platform. This node provides access to 6 core resources including customers, jobs, appointments, technicians, locations, and estimates, enabling comprehensive automation of field service operations, scheduling workflows, and customer management processes.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![ServiceTitan](https://img.shields.io/badge/ServiceTitan-API-orange)
![Field Service](https://img.shields.io/badge/Field%20Service-Management-green)
![CRM](https://img.shields.io/badge/CRM-Integration-purple)

## Features

- **Customer Management** - Create, update, retrieve, and manage customer records with complete contact information
- **Job Operations** - Full job lifecycle management including creation, updates, status tracking, and completion workflows
- **Appointment Scheduling** - Schedule, reschedule, and manage service appointments with technician assignment
- **Technician Resources** - Access technician profiles, availability, skills, and performance data
- **Location Management** - Manage service locations, addresses, and property information
- **Estimate Handling** - Create, modify, and track service estimates and pricing information
- **Real-time Sync** - Keep ServiceTitan data synchronized with other business systems
- **Bulk Operations** - Process multiple records efficiently for data migration and batch updates

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-servicetitan`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-servicetitan
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-servicetitan.git
cd n8n-nodes-servicetitan
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-servicetitan
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your ServiceTitan API key from the developer portal | Yes |
| Tenant ID | Your ServiceTitan tenant identifier | Yes |
| App Key | Application key for API access | Yes |
| Environment | API environment (sandbox or production) | Yes |

## Resources & Operations

### 1. Customer

| Operation | Description |
|-----------|-------------|
| Create | Create a new customer record |
| Get | Retrieve customer information by ID |
| Update | Update existing customer details |
| Delete | Remove a customer from the system |
| List | Get a list of customers with filtering options |
| Search | Search customers by name, phone, or email |

### 2. Job

| Operation | Description |
|-----------|-------------|
| Create | Create a new service job |
| Get | Retrieve job details by ID |
| Update | Update job information and status |
| Delete | Cancel or remove a job |
| List | Get jobs with date and status filters |
| Complete | Mark a job as completed |
| Assign | Assign technician to a job |

### 3. Appointment

| Operation | Description |
|-----------|-------------|
| Create | Schedule a new service appointment |
| Get | Retrieve appointment details |
| Update | Modify appointment time or details |
| Cancel | Cancel an existing appointment |
| List | Get appointments by date range |
| Reschedule | Change appointment date/time |
| Assign Technician | Assign or reassign technician |

### 4. Technician

| Operation | Description |
|-----------|-------------|
| Create | Add a new technician to the system |
| Get | Retrieve technician profile and details |
| Update | Update technician information |
| Delete | Remove technician from active roster |
| List | Get all technicians with filters |
| Get Availability | Check technician schedule availability |
| Get Skills | Retrieve technician skills and certifications |

### 5. Location

| Operation | Description |
|-----------|-------------|
| Create | Add a new service location |
| Get | Retrieve location details by ID |
| Update | Update location information |
| Delete | Remove a location |
| List | Get locations with geographic filters |
| Search | Search locations by address or name |
| Get Service History | Retrieve service history for location |

### 6. Estimate

| Operation | Description |
|-----------|-------------|
| Create | Create a new service estimate |
| Get | Retrieve estimate details |
| Update | Modify estimate items or pricing |
| Delete | Remove an estimate |
| List | Get estimates by status or date |
| Convert to Job | Convert approved estimate to job |
| Send | Email estimate to customer |

## Usage Examples

```javascript
// Create a new customer
{
  "firstName": "John",
  "lastName": "Smith", 
  "email": "john.smith@email.com",
  "phoneNumber": "555-123-4567",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "90210"
  }
}
```

```javascript
// Schedule an appointment
{
  "customerId": 12345,
  "jobTypeId": 67890,
  "start": "2024-03-15T09:00:00Z",
  "end": "2024-03-15T11:00:00Z",
  "technicianId": 456,
  "notes": "Annual HVAC maintenance"
}
```

```javascript
// Create a job with estimate
{
  "customerId": 12345,
  "locationId": 98765,
  "jobTypeId": 67890,
  "priority": "High",
  "description": "Emergency plumbing repair",
  "estimateItems": [
    {
      "description": "Replace water heater",
      "quantity": 1,
      "unitPrice": 899.00
    }
  ]
}
```

```javascript
// Update technician availability
{
  "technicianId": 456,
  "date": "2024-03-15",
  "timeSlots": [
    {
      "start": "08:00",
      "end": "12:00",
      "available": true
    },
    {
      "start": "13:00", 
      "end": "17:00",
      "available": false
    }
  ]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API credentials | Verify API key, tenant ID, and app key are correct |
| 403 Forbidden | Insufficient permissions | Check API key permissions and user role access |
| 404 Not Found | Resource does not exist | Verify the resource ID exists in ServiceTitan |
| 422 Unprocessable Entity | Invalid request data | Review required fields and data format |
| 429 Too Many Requests | Rate limit exceeded | Implement retry logic with exponential backoff |
| 500 Internal Server Error | ServiceTitan server error | Wait and retry, contact ServiceTitan support if persistent |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-servicetitan/issues)
- **ServiceTitan API Docs**: [ServiceTitan Developer Portal](https://developer.servicetitan.com)
- **Field Service Community**: [ServiceTitan Community](https://community.servicetitan.com)