'use client'
import { signIn } from "next-auth/react"
import React from 'react';
const Loginbutton = () => {
     return <button onClick={() => signIn()} className='btn'>Login</button>
};

export default Loginbutton;