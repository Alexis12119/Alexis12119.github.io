// // Retrieve the input values from localStorage if they exist
// window.addEventListener('load', () => {
//   const validData = JSON.parse(localStorage.getItem('valid')) || {}
//   const nameInput = document.getElementById('register-name')
//   const emailInput = document.getElementById('register-email')
//   const passwordInput = document.getElementById('register-pass')

//   const storedName = localStorage.getItem('registerName')
//   const storedEmail = localStorage.getItem('registerEmail')
//   const storedPassword = localStorage.getItem('registerPassword')

//   if (storedName) {
//     nameInput.value = storedName
//   }

//   if (storedEmail) {
//     emailInput.value = storedEmail
//   }

//   if (storedPassword) {
//     passwordInput.value = storedPassword
//   }
// })

const handleFormSubmit = (event) => {
  event.preventDefault()

  const nameInput = document.getElementById('register-name')
  const emailInput = document.getElementById('register-email')
  const passwordInput = document.getElementById('register-pass')
  const name = nameInput.value.trim()
  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()

  emailInput.reportValidity()
  console.log(emailInput.reportValidity())

  // Check if input fields are empty
  if (name === '' || email === '' || password === '') {
    const errorMessage = document.getElementById('error-message')
    errorMessage.textContent = 'Please fill in all fields.'
    errorMessage.style.display = 'block'
    return
  }

  // Validate email format
  if (!emailInput.reportValidity()) {
    emailInput.focus()
  } else {
    // Store the input values in localStorage
    localStorage.setItem('registerName', name)
    localStorage.setItem('registerEmail', email)
    localStorage.setItem('registerPassword', password)

    // Retrieve existing data from localStorage or create an empty object if it doesn't exist
    const validData = JSON.parse(localStorage.getItem('valid')) || {}

    // Check if the email already exists in the stored data
    if (validData.hasOwnProperty(email)) {
      const errorMessage = document.getElementById('error-message')
      errorMessage.textContent = 'Email already exists.'
      errorMessage.style.display = 'block'
      emailInput.focus()
      console.log(2)
    } else {
      // Create the settings object for the new user
      const settings = {
        enableNotifications: false, // Set the default value for enableNotifications
        selectedLanguage: 'en', // Set the default value for selectedLanguage
        selectedTheme: 'light', // Set the default value for selectedTheme
        selectedFontSize: 'small', // Set the default value for selectedFontSize
      }

      // Add the new user to the stored data with their settings
      validData[email] = {
        name: name,
        password: password,
        settings: settings,
      }

      // Save the updated data back to localStorage
      localStorage.setItem('valid', JSON.stringify(validData))

      // Redirect to another page or perform other actions
      window.location.href = 'index.html'
    }
  }
}

/*=============== SHOW HIDDEN - PASSWORD ===============*/
const showHiddenPass = (loginPass, loginEye) => {
  const input = document.getElementById(loginPass),
    iconEye = document.getElementById(loginEye)

  iconEye.addEventListener('click', () => {
    // Change password to text
    if (input.type === 'password') {
      // Switch to text
      input.type = 'text'

      // Icon change
      iconEye.classList.add('ri-eye-line')
      iconEye.classList.remove('ri-eye-off-line')
    } else {
      // Change to password
      input.type = 'password'

      // Icon change
      iconEye.classList.remove('ri-eye-line')
      iconEye.classList.add('ri-eye-off-line')
    }
  })
}

showHiddenPass('register-pass', 'register-eye')
