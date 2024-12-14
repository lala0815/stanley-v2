import React from "react";
import { useNavigate } from "react-router-dom";
import { Video, Users } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
export const Home = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome, {user?.username}!
          </h1>
          <p className="text-xl text-gray-400">
            What would you like to do today?
          </p>
        </header>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            onClick={() => navigate("/stream/host")}
            className="bg-gray-800 rounded-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:bg-gray-750"
          >
            <Video className="h-12 w-12 text-purple-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Host a Stream
            </h2>
            <p className="text-gray-400">
              Start your own live stream and connect with your audience
            </p>
          </div>
          <div
            onClick={() => navigate("/streams")}
            className="bg-gray-800 rounded-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:bg-gray-750"
          >
            <Users className="h-12 w-12 text-purple-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Join a Stream
            </h2>
            <p className="text-gray-400">
              Discover and join other exciting live streams
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
