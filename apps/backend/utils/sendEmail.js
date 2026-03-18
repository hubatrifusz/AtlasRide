const nodemailer = require('nodemailer');

// Validate email credentials are loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️  Warning: EMAIL_USER and EMAIL_PASS not configured in .env file');
  console.warn('⚠️  Email sending will be disabled');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.rackhost.hu',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function formatDate(dateObj) {
  if (!dateObj || !dateObj.year) return '';
  const year = dateObj.year;
  const month = String(dateObj.month).padStart(2, '0');
  const day = String(dateObj.day).padStart(2, '0');
  return `${year}. ${month}. ${day}.`;
}

function formatTime(timeObj) {
  if (!timeObj || timeObj.hour === undefined) return '';
  const hour = String(timeObj.hour).padStart(2, '0');
  const minute = String(timeObj.minute).padStart(2, '0');
  return `${hour}:${minute}`;
}

function formatLocation(location) {
  if (!location) return '';
  const parts = [];
  if (location.zipCode) parts.push(location.zipCode);
  if (location.city) parts.push(location.city);
  if (location.street) parts.push(location.street);
  return parts.join(', ');
}

async function sendBookingEmail(booking) {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Skipping email send - credentials not configured');
    return;
  }

  const departureDate = formatDate(booking.departureDateTime?.date);
  const departureTime = formatTime(booking.departureDateTime?.time);
  const departureLocation = formatLocation(booking.departureLocation);
  const destinationLocation = formatLocation(booking.destinationLocation);

  // Customer email
  const customerEmailData = {
    to: booking.customer.email,
    subject: 'Atlas Ride ajánlatkérés visszaigazolás',
    html: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6b8fd4;">Ajánlatkérés megerősítése – Köszönjük, hogy minket választott!</h2>
      <p>Kedves ${booking.customer.fullName}!</p>
      <p>Örömmel értesítjük, hogy az ajánlatkérése sikeresen rögzítésre került. Az alábbiakban találja a részleteket:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 15px 0;"><strong>Az ajánlatkérés adatai:</strong></p>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong>Indulás időpontja:</strong> ${departureDate} ${departureTime}
          </li>
          <li style="padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong>Indulási hely:</strong> ${departureLocation}
          </li>
          <li style="padding: 8px 0; border-bottom: 1px solid #ddd;">
            <strong>Célállomás:</strong> ${destinationLocation}
          </li>
          <li style="padding: 8px 0;">
            <strong>Utasok száma:</strong> ${booking.passengerCount} fő
          </li>
        </ul>
      </div>

      ${
        booking.returnInfo?.isReturn
          ? `<p><strong style="color: #6b8fd4;">Visszaút:</strong> ${formatDate(
              booking.returnInfo.returnDateTime?.date,
            )} ${formatTime(booking.returnInfo.returnDateTime?.time)}</p>`
          : ''
      }

      <p style="margin-top: 30px;">Hamarosan felvesszük Önnel a kapcsolatot az ajánlattal kapcsolatban.</p>
      
      <p style="margin-top: 20px;">Bármilyen kérdés esetén forduljon hozzánk bizalommal:</p>
      <p style="margin: 5px 0;">
        <strong>Email:</strong> <a href="mailto:info@atlasride.hu" style="color: #6b8fd4; text-decoration: none;">info@atlasride.hu</a><br>
        <strong>Telefon:</strong> <a href="tel:+36706005522" style="color: #6b8fd4; text-decoration: none;">+36 70 600 5522</a>
      </p>
      
      <p style="margin-top: 30px;">Üdvözlettel,<br><strong>Atlas Ride csapata</strong></p>
    </div>`,
  };

  // Build admin email fields dynamically
  const adminFields = [
    ['Név', booking.customer.fullName],
    ['Email cím', booking.customer.email],
    ['Telefonszám', booking.customer.phone],
  ];

  // Add company location if exists
  if (booking.customer.companyLocation) {
    const companyLoc = formatLocation(booking.customer.companyLocation);
    if (companyLoc) {
      adminFields.push(['Céges telephely', companyLoc]);
    }
  }

  adminFields.push(
    ['Utasok száma', booking.passengerCount],
    ['Indulási hely', departureLocation],
    ['Indulási időpont', `${departureDate} ${departureTime}`],
    ['Célállomás', destinationLocation],
  );

  // Add flight information if exists
  if (booking.flightInfo?.outboundFlightNumber) {
    adminFields.push([booking.departureLocation.isAirport ? 'Induló járatszám' : 'Érkezési járatszám', booking.flightInfo.outboundFlightNumber]);
    if (booking.flightInfo.returnFlightNumber) {
      adminFields.push([booking.departureLocation.isAirport ? 'Visszaút járatszám' : 'Visszaút érkezési járatszám', booking.flightInfo.returnFlightNumber]);
    }
  }

  // Add return trip info
  if (booking.returnInfo?.isReturn && booking.returnInfo.returnDateTime) {
    const returnDate = formatDate(booking.returnInfo.returnDateTime.date);
    const returnTime = formatTime(booking.returnInfo.returnDateTime.time);
    adminFields.push(['Visszaút', 'Igen'], ['Visszaút időpontja', `${returnDate} ${returnTime}`]);
  } else {
    adminFields.push(['Visszaút', 'Nem']);
  }

  // Add comment if exists
  if (booking.comment) {
    adminFields.push(['Megjegyzés', booking.comment]);
  }

  const listItems = adminFields
    .filter(([_, value]) => value && value !== '')
    .map(([label, value]) => `<li style="padding: 5px 0;"><strong>${label}:</strong> ${value}</li>`)
    .join('');

  const adminEmailData = {
    to: 'info@atlasride.hu',
    subject: `Új ajánlatkérés - ${booking.customer.fullName}`,
    html: `<div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #6b8fd4;">Új ajánlatkérés érkezett</h2>
    <p>Az alábbi adatokkal:</p>
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
      <p style="margin: 0 0 10px 0;"><strong>Ajánlatkérés adatai:</strong></p>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${listItems}
      </ul>
    </div>
    <p style="margin-top: 20px; color: #666; font-size: 12px;">
      Foglalás azonosító: ${booking._id}<br>
      Beérkezés időpontja: ${new Date(booking.createdAt).toLocaleString('hu-HU')}
    </p>
  </div>`,
  };

  // Send both emails concurrently
  try {
    await Promise.all([
      transporter.sendMail({
        from: '"Atlas Ride" <info@atlasride.hu>',
        to: customerEmailData.to,
        subject: customerEmailData.subject,
        html: customerEmailData.html,
      }),
      transporter.sendMail({
        from: '"Atlas Ride" <info@atlasride.hu>',
        to: adminEmailData.to,
        subject: adminEmailData.subject,
        html: adminEmailData.html,
      }),
    ]);
    console.log('✅ Emails sent successfully');
  } catch (error) {
    console.error('❌ Error sending emails:', error.message);
    throw error; // Re-throw to let the caller handle it
  }
}

module.exports = sendBookingEmail;
