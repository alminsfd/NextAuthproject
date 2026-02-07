'use client';
import React from 'react';
import Loginbutton from './Loginbutton';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
const Authbutton = () => {
     const session = useSession()
     return (

          <div className="flex gap-5">
               {
                    session.status === 'authenticated' ? <button className='btn' onClick={() => signOut()} >Logout</button> : <>
                         <Loginbutton></Loginbutton>
                         <Link href={"/register"} className="btn">
                              Register
                         </Link>
                    </>
               }

          </div>
     );
};

export default Authbutton;