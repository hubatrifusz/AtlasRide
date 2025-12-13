export function useBooking() {
  const postNewBooking = async (form: any) => {
    try {
      console.log(form);
      const response = await $fetch('https://atlas-ride-backend.vercel.app/api', {
        method: 'POST',
        body: form,
      });

      return response;
    } catch (error) {
      console.error('Error posting new booking:', error);
      throw error;
    }
  };

  const getAllBooking = async () => {
    const response = await fetch(`https://atlas-ride-backend.vercel.app/api`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  };

  return {
    postNewBooking,
    getAllBooking,
  };
}
