import React, { useEffect } from 'react';

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (message === "You are not logged in") {
        window.location.href = "/login";
      } else if (message === "You have reached your daily limit") {
        window.location.href = "/";
      } else {
        window.location.href = "/";
      }
    }, 4000);

    return () => clearTimeout(redirectTimeout);
  }, [message]);

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-slate-900">
        <div className="max-w- mx-auto p-6 bg-purple-950 rounded-lg shadow-lg scale-150">
          <h1 className="text-3xl text-center font-bold mb-4 text-red-600">{message}</h1>
          {message === "You are not logged in" || message === "You have reached your daily limit" ? (
            <>
            </>
          ) : (
            <p className="text-red-600 text-center">Hmm, you were not supposed to reach this page...</p>
          )}
          {message === "You have reached your daily limit" ? (
            <>
              <p className="text-red-600 text-center">You reached your daily limit, please come back tomorrow.</p>
            </>
          ) : (
            <></>
          )}
          <p className="text-red-600 text-center mt-5">We'll redirect you in 4s, hold on...</p>
        </div>
      </div>
    </>
  );
};

export default Error;
