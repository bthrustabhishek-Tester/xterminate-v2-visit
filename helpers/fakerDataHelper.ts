import { faker } from '@faker-js/faker';

export interface GeneratedCustomer {
  title: string;
  firstName: string;
  lastName: string;
  displayName: string;
  companyName: string;
  barcode: string;
  email: string;
  phone: string;
  mobile: string;
  postalCode: string;
  street1: string;
  street2: string;
  unitNo: string;
  remarks: string;
}

export interface GeneratedVisit {
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  ticketType: 'Inspection' | 'Maintenance' | 'Emergency' | 'Recurring';
  scheduleDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  notes: string;
}

export class FakerDataHelper {
  /**
   * Generates realistic, unique Customer CRM profile with Singapore localized address formats.
   */
  static generateCustomer(type: 'company' | 'individual' = 'company'): GeneratedCustomer {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const company = `${faker.company.name()} Pte Ltd`;
    const uniqueSuffix = faker.string.alphanumeric(5).toUpperCase();

    const displayName = type === 'company' 
      ? `${company} (${firstName})` 
      : `${firstName} ${lastName}`;

    const sgPhonePrefix = faker.helpers.arrayElement(['8', '9']);
    const sgPhone = `+65 ${sgPhonePrefix}${faker.string.numeric(7)}`;
    const sgMobile = `+65 ${sgPhonePrefix}${faker.string.numeric(7)}`;

    const floor = faker.number.int({ min: 1, max: 35 }).toString().padStart(2, '0');
    const unit = faker.number.int({ min: 10, max: 999 }).toString();

    return {
      title: faker.helpers.arrayElement(['Mr', 'Ms', 'Mrs', 'Dr']),
      firstName,
      lastName,
      displayName,
      companyName: company,
      barcode: `CUST-${uniqueSuffix}`,
      email: faker.internet.email({ firstName, lastName, provider: 'autotest.xterminate.com' }).toLowerCase(),
      phone: sgPhone,
      mobile: sgMobile,
      postalCode: faker.string.numeric(6),
      street1: `${faker.location.buildingNumber()} ${faker.location.street()}`,
      street2: faker.location.secondaryAddress(),
      unitNo: `#${floor}-${unit}`,
      remarks: `Automated test profile created on ${new Date().toISOString()}`,
    };
  }

  /**
   * Generates unique Visit / Job creation payload.
   */
  static generateVisit(): GeneratedVisit {
    const futureDate = faker.date.soon({ days: 14 });
    const formattedDate = futureDate.toISOString().split('T')[0];

    return {
      title: `Job ${faker.word.adjective()} ${faker.word.noun()} - ${faker.string.alphanumeric(4).toUpperCase()}`,
      description: faker.lorem.sentence({ min: 6, max: 12 }),
      priority: faker.helpers.arrayElement(['low', 'normal', 'high', 'urgent']),
      ticketType: faker.helpers.arrayElement(['Inspection', 'Maintenance', 'Emergency', 'Recurring']),
      scheduleDate: formattedDate,
      startTime: '09:00',
      endTime: '11:00',
      notes: faker.lorem.paragraph(1),
    };
  }

  /**
   * Generates dynamic financial quotation item details.
   */
  static generateLineItem() {
    return {
      name: `Service: ${faker.commerce.productName()}`,
      description: faker.commerce.productDescription(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      rate: parseFloat(faker.commerce.price({ min: 50, max: 1500, dec: 2 })),
      taxPercentage: 9.0, // Singapore GST
    };
  }
}
