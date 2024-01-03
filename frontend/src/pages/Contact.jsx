/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import PropTypes from "prop-types";

const Contact = ({ isLoggedIn, toast }) => {
  const form = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 70);

    return () => clearTimeout(timeoutId);
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please log in to submit the form.");
      return;
    }

    emailjs
      .sendForm(
        "service_u7kj057",
        "template_4ptotpq",
        form.current,
        "Nkz7vK-OK1ycQpFui"
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log("message sent!");
          console.log("Wait for a minutes to receive the email");

          toast.success("Email sent successfully!");
        },
        (error) => {
          console.log(error.text);
          toast.error("Failed to send email.");
        }
      );
  };

  return (
    <div className={`hero__section bg-white px-6 py-24 sm:py-10 lg:px-8 ${loading ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0'} transition-all duration-1000 ease-in-out`}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Contact Us
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Write me a Message 👇
        </p>
      </div>
      <form
        ref={form}
        onSubmit={sendEmail}
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="your-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Your Name:
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="from_name"
                id="your-name"
                autoComplete="organization"
                placeholder="Your name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Your Email:
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="from_email"
                id="email"
                placeholder="Your email"
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Message:
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                rows={5}
                placeholder="Write your message here.."
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

Contact.propTypes = {
  toast: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Contact;
