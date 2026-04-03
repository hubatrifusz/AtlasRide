export type BookingForm = {
  customer: {
    fullName: string
    email: string
    phone: string
    companyLocation?: Address
  }
  departure: {
    location: Location
    dateTime?: string
  }
  destination: {
    location: Location
    dateTime?: string
  }
  passengerCount: number
  returnInfo?: {
    dateTime: string
  }
  flightInfo?: {
    outboundFlightNumber: string
    inboundFlightNumber: string
  }
  comment?: string
}

type Address = {
  kind: 'Address'
  city: string
  street?: string
  zipCode?: string
}

type Airport = {
  kind: 'Airport'
  city: string
  name: string
  IATACode: string
}

type Location = Address | Airport
