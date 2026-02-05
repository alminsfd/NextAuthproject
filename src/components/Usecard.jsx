'use client'
import { useSession } from 'next-auth/react';
import React from 'react';
const Usecard = () => {
     const session = useSession()
     return (
          <div>
               <h1>userS: {JSON.stringify(session)}</h1>
          </div>
     );
};

export default Usecard;