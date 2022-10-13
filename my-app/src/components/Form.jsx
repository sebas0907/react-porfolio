import React from 'react';
import axios from 'axios';
import FacebookIcon from '../icons/FacebookIcon';
import GithubIcon from '../icons/GithubIcon';
import LinkedinIcon from '../icons/LinkedinIcon';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Form() {

    const [name, setName] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const onSubmit = data => {

        axios.post("/posts", data)
        .then(()=>window.location="/")
        .then(res => console.log(res))
        .catch(err => console.log(err));
        
        alert("Thank you for your message!");
    }

    return(
        <section id="contact" className="relative bg-gray-200">
            <div className="container px-5 py-10 mx-auto flex sm:flex-nowrap flex-wrap">
                <form onSubmit={handleSubmit(onSubmit)} className="lg:w-1/3 md:w-1/2 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
                    <h2 className="text-black sm:text-4xl text-3xl mb-2 font-medium title-font">Contact Me!</h2>
                    <div className="relative mb-4">
                        <label htmlFor="name" className="leading-7 text-sm text-gray-800">Name</label>
                        <input placeholder="Name" type="text" {...register("name", { required: true, minLength: 3, maxLength: 20, onChange: e=>setName(e.target.value)} )}  className="w-full rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                        {errors.name && <p className="text-error">Invalid Input!</p>}
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-800">Email</label>
                        <input placeholder="Email" type="email" {...register("email", { required: true, pattern: regex})} className="w-full rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                        {errors.email && <p className="text-error">Invalid Input!</p>}
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="message" className="leading-7 text-sm text-gray-800">Message</label>
                        <textarea placeholder="Write a message..." type="text" {...register("message", { required: true, minLength: 10, maxLength: 300 })} className="w-full rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"/>
                        {errors.message && <p className="text-error">Invalid Input!</p>}
                    </div>
                    <button type="submit" className="text-white bg-indigo-900 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Submit</button>
                </form>
                <div className="w-screen md:w-1/2 lg:w-2/3 text-black flex flex-col items-center py-20 sm:text-3xl text-2xl font-normal">Hello
                <p className="text-purple-600">{name.split(" ")[0]}<span role="img" aria-label="smiley">🙂</span></p> 
                Nice to meet you!
                <p>What can I do for you?</p>
                </div>
            </div>
            <div className="container px-5 py-10 mx-auto">
                <footer className="text-gray-800 inline-flex space-x-2">
                    <a href="https://www.facebook.com/mephistophenom" rel="noreferrer" target="_blank"><i><FacebookIcon /></i></a>
                    <a href="https://www.github.com/sebas0907" rel="noreferrer" target="_blank"><i><GithubIcon /></i></a>
                    <a href="https://www.linkedin.com/in/sebastian-arenas-68177b174/" rel="noreferrer" target="_blank"><i><LinkedinIcon /></i></a>
                    <p >© 2022 Sebastian Arenas.</p>
                </footer>
            </div>
        </section>
    );
}
//lg:w-1/3 md:w-1/2 
