// src/components/Sidebar.tsx
import React, { useState, type JSX } from "react";
import { MdDashboard, MdPeople, MdLibraryBooks, MdAssignment, MdWarning  } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface SidebarItem {
  id: string;
  label: string;
  icon: JSX.Element;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const navigate = useNavigate();

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    if (itemId === "dashboard") navigate(`/dashboard`);
    else navigate(`/dashboard/${itemId}`);
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard className="w-6 h-6" />,
    },
    {
      id: "readers",
      label: "Readers",
      icon: <MdPeople className="w-6 h-6" />,
    },
    {
      id: "books",
      label: "Books",
      icon: <MdLibraryBooks className="w-6 h-6" />,
    },
    {
      id: "lendings",
      label: "Lendings",
      icon: <MdAssignment className="w-6 h-6" />,
    },
     {
      id: "overdue",             // New item id
      label: "Overdue",          // Label
      icon: <MdWarning className="w-6 h-6" />,  // Warning icon for overdue
    },
  ];

  return (
    <aside className="bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700 text-white w-64 min-h-screen shadow-lg flex flex-col p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-center tracking-wide select-none text-white">
          Admin Panel
        </h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-3">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-4 w-full rounded-lg px-5 py-3 font-semibold transition-all duration-300
                  ${
                    activeItem === item.id
                      ? "bg-purple-200 text-purple-900 shadow-lg transform scale-105"
                      : "text-purple-300 hover:text-white hover:bg-purple-700"
                  }
                `}
                aria-current={activeItem === item.id ? "page" : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-auto text-center text-purple-300 text-sm select-none">
        © 2025 Book Club
      </footer>
    </aside>
  );
};

export default Sidebar;
