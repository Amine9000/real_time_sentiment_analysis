import React, { useState, useRef, useEffect } from 'react';
import { FaComment } from 'react-icons/fa'; // Import de l'icône de commentaire depuis Font Awesome
import { IoSend } from "react-icons/io5";
import io from 'socket.io-client';
import { FeedbackCarousel } from "@/components/feedback/FeedbackCarousel"
import '../index.css'

const socket = io('http://localhost:3000');

const CommentSection: React.FC = () => {
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
   const handleNewMessage = (message: string) => {
     console.log(message);
     setMessages((prevMessages) => [...prevMessages, message]);
   };

   const handleMessages = (newMessages) => {
     setMessages(JSON.parse(newMessages).map(message => message.comment));
   };

   socket.on('newmassage', handleNewMessage);
   socket.on('messages', handleMessages);

   return () => {
     socket.off('newmassage', handleNewMessage);
     socket.off('messages', handleMessages);
   };
 }, []);
 const sendMessage = () => {
   if (newMessage.trim() !== '') {
     socket.emit('newmassage', newMessage);
     setNewMessage('');
   }
 };



  return (
    <div className="w-full pt-1 bg-gray-950 h-full">
    <div className="absolute z-1 w-screen min-h-screen">
      <div className="bg-gray-600 opacity-50 fixed rounded left-[250px] top-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 w-[400px] h-60" ></div>
      <div className="bg-gray-600 opacity-50 fixed rounded left-2/3 top-1/2 bg-gradient-to-r from-sky-500 to-indigo-500 w-52 h-[500px]" ></div>
      <div className="bg-gray-600 opacity-50 fixed rounded left-2/3 top-4/5 bg-gradient-to-r from-violet-500 to-fuchsia-500 w-52 h-60" ></div>
      <div className="bg-gray-600 opacity-50 fixed rounded left-[250px] top-4/5 bg-gradient-to-r from-purple-500 to-pink-500 w-52 h-60" ></div>
    </div>
    <div className="flex justify-center items-start min-h-screen">
      <div className="w-full lg:w-1/2 h-full">
        <div className="h-full bg-opacity-10 bg-gray-50 backdrop-blur-md rounded-lg border border-opacity-20 border-white shadow-md text-white text-center">
          <div className="h-full flex flex-col justify-center p-4">
            <div className="mb-3">
              <FeedbackCarousel className="w-100 h-[300px]" />
            </div>
            <h5 className="text-start text-lg my-4">Comment Section</h5>
            <div className="flex gap-2">
              <textarea
                className="form-control bg-gray-900 text-white w-full p-4 rounded"
                rows={3}
                placeholder="Write a comment..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              ></textarea>
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white h-100 w-24 flex items-center justify-center rounded"
              >
                <IoSend />
              </button>
            </div>
            <div
              ref={commentsContainerRef}
              className="mt-3 h-auto w-100"
            >
              {messages.map((message, index) => (
                <div key={index} className="border-b border-gray-700 pb-2 mb-2 w-100">
                  <div className="flex gap-1 w-100">
                    <div className="w-10 bg-slate-950 text-wite flex items-center justify-center rounded"><FaComment className="m-2 text-gray-400" /></div>
                    <p className="text-start bg-slate-900 text-sm p-4 w-100 flex-grow rounded">
                      {message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CommentSection;
