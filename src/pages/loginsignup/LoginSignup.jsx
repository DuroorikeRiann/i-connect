import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function VendorSignUp() {

  const { setUser } = useUser();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_Name: "",
    last_Name: "",
    email: "",
    phone: "",
    username: "",
    location: "",
    role: "",
    password: "",
    imageUrl: "null",
    bio: "null",
  });

  const [formLoginData, setFormLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    console.log(JSON.stringify(formData));
  };

  const handleLoginChange = (e) => {
    setFormLoginData({ ...formLoginData, [e.target.name]: e.target.value });
  };

  // sign up vendor logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://i-connect-wj57.onrender.com/api/user/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Sign up successful!");

        const response = await axios.post(
          "https://i-connect-wj57.onrender.com/api/user/login",
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          // Store the token in local storage or state management
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("userId", response.data._id);

          // Redirect to home
          window.location.href = "/";

          console.log(response.data);
        } else {
          // Handle error response from server
          console.error("Login failed:", response.data.message);
          // Display error message to user
          alert("Signup successful, please login");

          // Redirect to login page
          window.location.href = "/";
        }
      } else {
        alert("Sign-up failed");
        console.error("Sign-up failed:", response.data.message);
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
      console.error("Error signing up:", error.message);
    }
  };

  // General login logic
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://i-connect-wj57.onrender.com/api/user/login",
        formLoginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Store the token in local storage or state management
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("userId", response.data._id);

          // Get the token from local storage
          const userId = localStorage.getItem("userId");
      
          const token = localStorage.getItem("token");
      
          // If token is not found, return null or handle as appropriate
          if (!token) {
            return null;
          }
      
          try {
            // Make a request to the server to get the user information
            const response = await axios.get(
              `https://i-connect-wj57.onrender.com/api/user/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Send the token in the Authorization header
                },
              }
            );
            // If request is successful, return the user data
            setUser(response.data);
          } catch (error) {
            
            console.error("Error fetching user:", error.message);
            return null;
          }

        // Redirect to previous page
        navigate(-1);

        console.log(response.data);
        
      } 
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          // Handle unauthorized (401) error
          console.error("Login failed:", error.response.data.message);
          alert("Login failed. Email or password is not correct.");
        } else {
          // Handle other error responses
          console.error("Error logging in:", error.response.data);
          alert("Login failed. Please try again later.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
    
  };

  return (
    <div>
      <div>
        <h2>Sign-up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_Name"
            value={formData.first_Name}
            onChange={handleChange}
            placeholder="first Name"
            required
          />
          <input
            type="text"
            name="last_Name"
            value={formData.last_Name}
            onChange={handleChange}
            placeholder=" last Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="location"
            required
          />
          <select
            name="role"
            onChange={handleChange}
            value={formData.role}
            id="">
            <option value="">Sign up as</option>
            <option value="vendor">Service Provider</option>
            <option value="customer">Service Seeker</option>
          </select>
          {/* <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="role"
            required
          /> */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <br/>
      <br/>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="text"
            name="email"
            value={formLoginData.email}
            onChange={handleLoginChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formLoginData.password}
            onChange={handleLoginChange}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default VendorSignUp;
