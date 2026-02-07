// signup.js
import { supabase } from './supabase.js'

const signupForm = document.getElementById('signupForm')

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  // Get form values
  const full_name = document.getElementById('full_name').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  try {
    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if (authError) throw authError

    // Insert user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id, // make profile ID same as user ID
          name: full_name,
          role: 'customer',      // default role
          email: email
        }
      ])

    if (profileError) throw profileError

    alert('Signup successful! Please check your email to confirm your account.')
    window.location.href = 'login.html'

  } catch (err) {
    alert('Error signing up: ' + err.message)
  }
})
