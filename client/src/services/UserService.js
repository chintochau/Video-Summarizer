const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

export const getUserDataByEmail = async ({ email }) => {
  try {
    const response = await fetch(`${apiUrl}/users/profile/${email}`);
    const userData = await response.json();

    // Do something with the userData received
    return userData
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

/**
 * Creates a new user account based on provided user data using the email.
 * @param {object} userData - The user data object containing at least an email field.
 * @returns {Promise<void>} - A Promise that resolves after attempting to create the user account.
 */
export const createUserAccountByEmail = async (userData) => {
  const { email } = userData;
  
  try {
    const response = await fetch(`${apiUrl}/users/new-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (response.ok) {
      const newUser = await response.json();
      console.log('User account created:', newUser);
      // Perform any necessary actions after successful user creation
    } else {
      console.error('Failed to create user account');
    }
  } catch (error) {
    console.error('Error creating user account:', error);
  }
};

