export function useBooking() {
  const postNewBooking = async (form: any) => {
    try {
      console.log(form);
      const response = await $fetch('https://backend-516266244601.europe-central2.run.app/api', {
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
    const response = await fetch(`https://backend-516266244601.europe-central2.run.app/api`);
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
