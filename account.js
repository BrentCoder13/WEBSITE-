import { supabase } from './supabase.js'

const form = document.getElementById('profileForm')
const nameInput = document.getElementById('name')
const contactInput = document.getElementById('contact')
const tableBody = document.querySelector('#appointmentsTable tbody')

// Load profile & appointments on page load
window.addEventListener('DOMContentLoaded', async () => {
  const { data: user } = await supabase.auth.getUser()
  if (!user) return window.location.href = 'login.html'
  const userId = user.id

  // Load profile info
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, contact')
    .eq('id', userId)
    .single()
  if (profileError) return alert(profileError.message)
  nameInput.value = profile.name
  contactInput.value = profile.contact

  // Load appointments
  const { data: appointments, error: appError } = await supabase
    .from('appointments')
    .select('service, appointment_date, status')
    .eq('user_id', userId)
    .order('appointment_date', { ascending: true })
  if (appError) return alert(appError.message)

  tableBody.innerHTML = ''
  appointments.forEach(app => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${app.service}</td>
      <td>${app.appointment_date}</td>
      <td>${app.status}</td>
    `
    tableBody.appendChild(tr)
  })
})

// Update profile on submit
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const { data, error } = await supabase
    .from('profiles')
    .update({ name: nameInput.value, contact: contactInput.value })
    .eq('id', supabase.auth.user().id)
  if (error) alert(error.message)
  else alert('Profile updated!')
})
