export function useBooking() {
  const postNewBooking = async (form: any) => {
    try {
      const response = await $fetch('http://localhost:3002/api', {
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
    const response = await fetch(`http://localhost:3002/api`);
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
