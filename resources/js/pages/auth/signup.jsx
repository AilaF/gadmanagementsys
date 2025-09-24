import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';


export default function Signup() {
  const { data, setData, post, processing, errors } = useForm({
    fname: '',
    lname: '',
    mname: '',
    email: '',
    department: '',
    password: '',
    password_confirmation: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    post('/signup');
  }

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={data.fname}
          onChange={e => setData('fname', e.target.value)}
        />
        {errors.fname && <div>{errors.fname}</div>}

        <input
          type="text"
          placeholder="Last Name"
          value={data.lname}
          onChange={e => setData('lname', e.target.value)}
        />

        <input
          type="text"
          placeholder="M.I."
          value={data.mname}
          onChange={e => setData('mname', e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={e => setData('email', e.target.value)}
        />

        <select
          value={data.department}
          onChange={e => setData('department', e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="CAS">CAS</option>
          <option value="CED">CED</option>
          <option value="CoE">CoE</option>
          <option value="CIC">CIC</option>
          <option value="CBA">CBA</option>
          <option value="CAEc">CAEc</option>
          <option value="CoT">CoT</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={e => setData('password', e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={data.password_confirmation}
          onChange={e => setData('password_confirmation', e.target.value)}
        />

        <button type="submit" disabled={processing}>
          Create Account
        </button>
      </form>

      <p>
          Already have an account? <Link href="/login">Sign In</Link>
      </p>
    </div>
  );
}
