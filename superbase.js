// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const supabase = createClient(
  'https://usqsmrmslyplziguwvgo.supabase.co', 
  'sb_publishable_qMhgLl5jgjx8xSXMoq-MGw_3_ydQO-4'
)

// === 2️⃣ Admin Role Check ===
async function checkAdmin() {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    alert('Please login first')
    window.location.href = 'login.html'
    return
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    alert('Access denied. Admins only.')
    window.location.href = 'booking.html'
    return
  }
}

// Call the admin check before anything else
checkAdmin()

// === 3️⃣ Admin Dashboard Dynamic Table ===
const tableBody = document.querySelector('tbody')

// Load appointments on page load
window.addEventListener('DOMContentLoaded', loadAppointments)

async function loadAppointments() {
  try {
    // Get all appointments with user info
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        service,
        appointment_date,
        status,
        user_id,
        profiles!inner(
          id,
          role,
          email,
          name,
          contact
        )
      `)

    if (error) throw error

    // Clear existing rows
    tableBody.innerHTML = ''

    data.forEach(app => {
      const tr = document.createElement('tr')

      // Fill table row
      tr.innerHTML = `
        <td>${app.profiles.name || 'N/A'}</td>
        <td>${app.profiles.email}</td>
        <td>${app.profiles.contact || 'N/A'}</td>
        <td>${app.appointment_date}</td>
        <td>${app.status}</td>
        <td>
          <select>
            <option ${app.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option ${app.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option ${app.status === 'Declined' ? 'selected' : ''}>Declined</option>
          </select>
          <button>Update</button>
        </td>
      `

      // Add click event for update button
      const updateBtn = tr.querySelector('button')
      const selectStatus = tr.querySelector('select')
      updateBtn.addEventListener('click', async () => {
        try {
          const { data: updated, error: updateError } = await supabase
            .from('appointments')
            .update({ status: selectStatus.value })
            .eq('id', app.id)
          if (updateError) throw updateError
          loadAppointments() // refresh table
        } catch (err) {
          alert(err.message)
        }
      })

      tableBody.appendChild(tr)
    })
  } catch (err) {
    alert('Error loading appointments: ' + err.message)
  }
}
