import { supabase } from './supabase.js'

const form = document.getElementById('bookingForm')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  // Get logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) return alert('Please login first!')

  // Get values from form
  const full_name = document.getElementById('full_name').value
  const email = document.getElementById('email').value
  const contact_number = document.getElementById('contact_number').value
  const address = document.getElementById('address').value
  const service_date = document.getElementById('service_date').value

  // Insert into appointments table
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      user_id: user.id,
      service: full_name, // or map to specific service if needed
      appointment_date: service_date,
      status: 'Pending'
    }])

  if (error) return alert('Error booking appointment: ' + error.message)
  alert('Appointment request submitted!')
  form.reset()
})
