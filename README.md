# n8n-nodes-servicetitan

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for ServiceTitan, the leading field service management platform valued at $9B+, serving plumbing, HVAC, electrical, and other home service businesses. This node provides complete API integration for managing customers, jobs, appointments, invoicing, dispatch, technicians, and more.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![ServiceTitan](https://img.shields.io/badge/ServiceTitan-API%20V2-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## Features

- **17 Resource Categories** - Complete coverage of ServiceTitan's REST API V2
- **100+ Operations** - Full CRUD operations plus specialized actions
- **OAuth 2.0 Authentication** - Secure client credentials flow with automatic token refresh
- **Webhook Triggers** - Real-time event notifications for jobs, appointments, invoices, and more
- **Pagination Support** - Efficient handling of large datasets with returnAll option
- **Error Handling** - Comprehensive error messages with continueOnFail support
- **Sandbox Environment** - Test integration before going to production

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-servicetitan`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the package
npm install n8n-nodes-servicetitan
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-servicetitan.git
cd n8n-nodes-servicetitan

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-servicetitan

# Restart n8n
n8n start
```

## Credentials Setup

### ServiceTitan API Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Client ID | OAuth 2.0 Client ID from ServiceTitan | Yes |
| Client Secret | OAuth 2.0 Client Secret | Yes |
| Tenant ID | Your ServiceTitan tenant/company ID | Yes |
| Environment | Production or Sandbox | Yes |
| API Host | Custom API host (optional) | No |
| Auth Host | Custom auth host (optional) | No |

### How to Obtain Credentials

1. Log in to your ServiceTitan account
2. Navigate to **Settings** > **Integrations** > **API Application Access**
3. Create a new API application or use an existing one
4. Copy the Client ID and Client Secret
5. Note your Tenant ID from the URL or settings
6. Enable required scopes for your integration

## Resources & Operations

### Customers
| Operation | Description |
|-----------|-------------|
| List Customers | Get all customers with filters |
| Get Customer | Get a specific customer by ID |
| Create Customer | Create a new customer |
| Update Customer | Update customer information |
| Get Contacts | Get customer contacts |
| Add Contact | Add a contact to customer |
| Get Locations | Get customer service locations |
| Get Notes | Get customer notes |
| Add Note | Add a note to customer |
| Get Equipment | Get customer equipment |

### Locations
| Operation | Description |
|-----------|-------------|
| List Locations | Get all locations |
| Get Location | Get location by ID |
| Create Location | Create a service location |
| Update Location | Update location details |
| Get Equipment | Get equipment at location |
| Get History | Get service history |

### Jobs
| Operation | Description |
|-----------|-------------|
| List Jobs | Get all jobs with filters |
| Get Job | Get job by ID |
| Create Job | Create a new job |
| Update Job | Update job details |
| Cancel Job | Cancel a job |
| Complete Job | Mark job as complete |
| Get Appointments | Get job appointments |
| Get Invoices | Get job invoices |
| Get History | Get job history |
| Get Notes | Get job notes |
| Add Note | Add note to job |

### Appointments
| Operation | Description |
|-----------|-------------|
| List Appointments | Get all appointments |
| Get Appointment | Get appointment by ID |
| Create Appointment | Schedule an appointment |
| Update Appointment | Update appointment details |
| Reschedule | Reschedule appointment |
| Cancel | Cancel appointment |
| Assign Technician | Assign tech to appointment |
| Unassign Technician | Remove tech from appointment |
| Complete | Mark appointment complete |

### Bookings
| Operation | Description |
|-----------|-------------|
| List Bookings | Get all bookings/inquiries |
| Get Booking | Get booking by ID |
| Create Booking | Create a new booking |
| Update Booking | Update booking details |
| Convert to Job | Convert booking to job |
| Dismiss | Dismiss a booking |

### Leads
| Operation | Description |
|-----------|-------------|
| List Leads | Get all leads |
| Get Lead | Get lead by ID |
| Create Lead | Create a new lead |
| Update Lead | Update lead information |
| Convert Lead | Convert lead to job |
| Dismiss Lead | Dismiss a lead |
| Add Follow-Up | Schedule a follow-up |

### Invoices
| Operation | Description |
|-----------|-------------|
| List Invoices | Get all invoices |
| Get Invoice | Get invoice by ID |
| Create Invoice | Create a new invoice |
| Update Invoice | Update invoice |
| Get Items | Get invoice line items |
| Add Item | Add line item to invoice |
| Remove Item | Remove line item |
| Email Invoice | Send invoice via email |
| Get Payments | Get invoice payments |

### Payments
| Operation | Description |
|-----------|-------------|
| List Payments | Get all payments |
| Get Payment | Get payment by ID |
| Create Payment | Record a payment |
| Refund Payment | Process a refund |
| Void Payment | Void a payment |

### Estimates
| Operation | Description |
|-----------|-------------|
| List Estimates | Get all estimates |
| Get Estimate | Get estimate by ID |
| Create Estimate | Create new estimate |
| Update Estimate | Update estimate |
| Approve | Approve an estimate |
| Decline | Decline an estimate |
| Convert to Invoice | Convert to invoice |
| Email Estimate | Send via email |

### Technicians
| Operation | Description |
|-----------|-------------|
| List Technicians | Get all technicians |
| Get Technician | Get technician by ID |
| Create Technician | Create technician profile |
| Update Technician | Update technician info |
| Get Schedule | Get technician schedule |
| Get Capacity | Get capacity info |
| Get Performance | Get performance metrics |

### Dispatch
| Operation | Description |
|-----------|-------------|
| Get Dispatch Board | View dispatch board |
| Get Zones | Get dispatch zones |
| Get Capacity | Get zone capacity |
| Optimize Routes | Optimize route assignments |

### Inventory
| Operation | Description |
|-----------|-------------|
| List Inventory | Get inventory items |
| Get Item | Get item by ID |
| Update Quantity | Update stock quantity |
| List Purchase Orders | Get purchase orders |
| Create Purchase Order | Create a PO |
| List Vendors | Get vendors |
| Get Warehouse Quantities | Get stock by warehouse |

### Pricebook
| Operation | Description |
|-----------|-------------|
| List Services | Get pricebook services |
| Get Service | Get service by ID |
| List Materials | Get materials |
| Get Material | Get material by ID |
| List Equipment | Get equipment types |
| Get Equipment | Get equipment by ID |

### Memberships
| Operation | Description |
|-----------|-------------|
| List Memberships | Get all memberships |
| Get Membership | Get membership by ID |
| Create Membership | Create membership |
| Update Membership | Update membership |
| Cancel Membership | Cancel a membership |
| Get Locations | Get membership locations |

### Campaigns
| Operation | Description |
|-----------|-------------|
| List Campaigns | Get marketing campaigns |
| Get Campaign | Get campaign by ID |
| Get Metrics | Get campaign metrics |

### Reports
| Operation | Description |
|-----------|-------------|
| Get Revenue Report | Revenue analytics |
| Get Technician Report | Tech performance |
| Get Call Report | Call metrics |
| Get Conversion Report | Conversion rates |
| Get Custom Report | Run custom reports |

### Users
| Operation | Description |
|-----------|-------------|
| List Users | Get all users |
| Get User | Get user by ID |
| Get Roles | Get user roles |
| Get Permissions | Get user permissions |

## Trigger Node

The ServiceTitan Trigger node listens for webhook events:

| Event | Description |
|-------|-------------|
| Job Created | New job is created |
| Job Completed | Job is marked complete |
| Appointment Scheduled | Appointment is booked |
| Appointment Completed | Appointment finished |
| Invoice Created | New invoice created |
| Payment Received | Payment is recorded |
| Customer Created | New customer created |
| Lead Created | New lead/booking created |
| Membership Created | Membership sold |
| Estimate Approved | Estimate is approved |

### Webhook Setup

1. Add the ServiceTitan Trigger node to your workflow
2. Copy the webhook URL from the node
3. In ServiceTitan, go to **Settings** > **Integrations** > **HTTP Integrations**
4. Create a new integration with your webhook URL
5. Select the events you want to receive
6. Save and activate the integration

## Usage Examples

### Create a Customer and Job

```javascript
// 1. Create Customer
{
  "resource": "customers",
  "operation": "createCustomer",
  "name": "John Smith",
  "type": "Residential",
  "email": "john@example.com",
  "phone": "(555) 123-4567"
}

// 2. Create Location for Customer
{
  "resource": "locations",
  "operation": "createLocation",
  "customerId": "{{ $node['Create Customer'].json.id }}",
  "street": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "zip": "12345"
}

// 3. Create Job
{
  "resource": "jobs",
  "operation": "createJob",
  "customerId": "{{ $node['Create Customer'].json.id }}",
  "locationId": "{{ $node['Create Location'].json.id }}",
  "businessUnitId": 1,
  "jobTypeId": 1,
  "priority": "Normal"
}
```

### List Jobs with Filters

```javascript
{
  "resource": "jobs",
  "operation": "listJobs",
  "returnAll": false,
  "limit": 50,
  "filters": {
    "active": true,
    "modifiedAfter": "2024-01-01",
    "technicianId": 123
  }
}
```

## ServiceTitan Concepts

| Concept | Description |
|---------|-------------|
| Tenant | Your ServiceTitan account/company |
| Customer | Service customer record |
| Location | Physical service location/property |
| Job | Service work order |
| Appointment | Scheduled visit/time slot |
| Booking | Inbound inquiry/request |
| Lead | Sales opportunity |
| Technician | Field service technician |
| Membership | Service agreement/contract |
| Pricebook | Catalog of services/materials |
| Campaign | Marketing campaign |
| Business Unit | Division/department |

## Error Handling

The node provides detailed error messages for common issues:

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid credentials | Check Client ID/Secret |
| 403 Forbidden | Insufficient permissions | Enable required scopes |
| 404 Not Found | Resource doesn't exist | Verify ID is correct |
| 429 Too Many Requests | Rate limit exceeded | Reduce request frequency |
| 500 Server Error | ServiceTitan issue | Retry or contact support |

Use the **Continue On Fail** option to handle errors gracefully in batch operations.

## Security Best Practices

1. **Never expose credentials** - Use n8n's credential system
2. **Use least privilege** - Only enable required API scopes
3. **Monitor usage** - Watch for unusual API activity
4. **Rotate secrets** - Regularly update Client Secret
5. **Use sandbox** - Test in sandbox before production
6. **Secure webhooks** - Validate webhook signatures

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)
- Email: licensing@velobpa.com

## Licensing

This n8n community node is licensed under the **Business Source License 1.1 (BSL 1.1)**.

### Free Use
Permitted for:
- Personal use
- Educational use
- Research use
- Internal business use

### Commercial Use
A commercial license is required for:
- SaaS/PaaS platforms
- Managed services
- Paid automation offerings
- Commercial integrations

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [ServiceTitan API Docs](https://developer.servicetitan.io/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-servicetitan/issues)
- **Commercial Support**: licensing@velobpa.com

## Acknowledgments

- [ServiceTitan](https://www.servicetitan.com/) for their comprehensive API
- [n8n](https://n8n.io/) for the excellent automation platform
- The n8n community for inspiration and best practices
