import type { CalendarDate, Time } from '@internationalized/date';

export interface BookingForm {
  customer: ContactInfo;
  homeAddress: Location;
  passengerCount: number;
  departureLocation: Location;
  departureDateTime: DateTime;
  destinationLocation: Location;
  returnInfo: { isReturn: false } | { isReturn: true; returnDateTime: DateTime };
  flightInfo?: FlightInfo;
  comment: string;
}

export interface FlightInfo {
  outboundFlightNumber: string;
  returnFlightNumber?: string;
}

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  companyLocation?: CompanyLocation;
}

export interface Location {
  city: string;
  street?: string;
  zipCode?: string;
  isAirport: boolean;
}

interface CompanyLocation {
  city: string;
  street: string;
  zipCode: string;
}

export interface FlightData {
  airport: string;
  flightNumber: string;
  takeoffTime: Date;
}

export type DateTime = {
  date?: CalendarDate;
  time?: Time;
};
