export interface ILogout {
  cookies: {
    refreshToken: string;
  };
}

export interface IStudent {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateofBirth: Date;
  gender: string;
  rollNumber: number;
  admissionNumber: string;
  admissionDate: Date;
  status: string;
  class: string;
  section: string;
  language: string;
  motherTongue: string;
  userId: string;
}

// firstName: 'John',
//   lastName: 'Doe',
//   email: 'john.doe@example2.com',
//   phone: '1234567890',
//   dateofBirth: '2000-01-01T00:00:00.000Z',
//   gender: 'male',
//   rollNumber: 12345,
//   admissionNumber: 'A123456',
//   admissionDate: '2023-08-27T00:00:00.000Z',
//   status: 'active',
//   class: '10th Grade',
//   section: 'A',
//   language: 'English',
//   motherTongue: 'russian',
//   userId: 'e7a5f27b-efed-44dd-b4ca-6dd9dfa10cfa'
