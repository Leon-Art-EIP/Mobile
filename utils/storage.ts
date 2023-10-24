import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to store a token in local storage
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('token', token);
    console.log('Token stored successfully.');
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Function to retrieve a token from local storage
export const retrieveToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      console.log('Token retrieved:', token);
    } else {
      console.log('Token not found in local storage.');
    }
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};
