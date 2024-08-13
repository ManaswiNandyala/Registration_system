import React, { useState, useEffect } from 'react';
import './UserForm.css';

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        dateOfBirth: '',
        password: '',
        gender: 'Male',
        about: ''  // Optional field
    });

    const [users, setUsers] = useState([]);  // State to hold fetched users
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Function to fetch users
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/');
                const result = await response.json();
                
                if (response.ok) {
                    setUsers(result.data);  // Update state with fetched users
                } else {
                    setMessage('Failed to fetch users');
                }
            } catch (error) {
                setMessage('An error occurred while fetching users');
            }
        };

        fetchUsers();  // Call the fetch function
    }, []);  // Empty dependency array means this runs once when the component mounts

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('User added successfully');
                setFormData({
                    name: '',
                    age: '',
                    dateOfBirth: '',
                    password: '',
                    gender: 'Male',
                    about: ''  // Reset to empty string
                });
            } else {
                setMessage(result.message || 'An error occurred');
            }
        } catch (error) {
            setMessage('An error occurred');
        }
    };

    return (
        <div className="user-form-container">
            <h2>Register User</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Age:
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="0"
                        max="120"
                        required
                    />
                </label>
                <label>
                    Date of Birth:
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="10"
                        required
                    />
                </label>
                <label>
                    Gender:
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
                <label>
                    About:
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        maxLength="5000"
                    />
                </label>
                <button type="submit">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UserForm;
