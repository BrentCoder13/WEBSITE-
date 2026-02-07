import { supabase } from './supabase.js'

const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return alert('Login failed: ' + error.message)

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if(profile.role === 'admin') {
    window.location.href = 'admin.html'
  } else {
    window.location.href = 'account.html'
  }
})
