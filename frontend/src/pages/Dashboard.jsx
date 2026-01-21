import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(false);



    const { token, logout } = useContext(AuthContext);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get("/tasks", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data);
        } catch (err) {
            alert("Failed to fetch tasks");
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {
        await api.post(
            "/tasks",
            { title },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTitle("");
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await api.delete(`/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchTasks();
    };

    const updateTask = async (id) => {
        await api.put(
            `/tasks/${id}`,
            { title: editTitle },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingId(null);
        setEditTitle("");
        fetchTasks();
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =
            filter === "all" || task.status === filter;

        return matchesSearch && matchesFilter;
    });



    const toggleStatus = async (task) => {
        await api.put(
            `/tasks/${task._id}`,
            {
                status: task.status === "pending" ? "completed" : "pending",
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        fetchTasks();
    };


    return (
        <div className="min-h-screen bg-neutral-950 text-white px-4 py-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <h1 className="text-2xl font-semibold">
                        Dashboard
                    </h1>

                    <button
                        onClick={logout}
                        className="text-sm text-red-400 hover:underline w-fit"
                    >
                        Logout
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        placeholder="Search tasks"
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2
                     text-white placeholder-neutral-500
                     focus:outline-none focus:border-neutral-600"
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2
                     text-white focus:outline-none focus:border-neutral-600"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Add Task */}
                <div className="flex gap-2 mb-6">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="New task"
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2
                     text-white placeholder-neutral-500
                     focus:outline-none focus:border-neutral-600"
                    />

                    <button
                        onClick={addTask}
                        className="px-4 rounded-md bg-white text-black
                     hover:bg-neutral-200 active:scale-[0.97]
                     transition-all"
                    >
                        Add
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="text-center text-neutral-400 mb-4">
                        Loading tasks...
                    </p>
                )}

                {/* Task List */}
                <ul className="space-y-3">
                    {filteredTasks.map((task) => (
                        <li
                            key={task._id}
                            className="bg-neutral-900 border border-neutral-800 rounded-lg p-4
                       flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >
                            {/* Left */}
                            <div className="flex-1">
                                {editingId === task._id ? (
                                    <input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1
                             text-white focus:outline-none"
                                    />
                                ) : (
                                    <p
                                        className={`font-medium ${task.status === "completed"
                                                ? "line-through text-neutral-500"
                                                : "text-white"
                                            }`}
                                    >
                                        {task.title}
                                    </p>
                                )}

                                <span
                                    className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${task.status === "completed"
                                            ? "bg-green-900 text-green-300"
                                            : "bg-yellow-900 text-yellow-300"
                                        }`}
                                >
                                    {task.status}
                                </span>
                            </div>

                            {/* Right */}
                            <div className="flex flex-wrap gap-2 text-sm">
                                <button
                                    onClick={() => toggleStatus(task)}
                                    className="px-3 py-1 rounded border border-neutral-700
                           hover:bg-neutral-800 transition"
                                >
                                    {task.status === "pending"
                                        ? "Mark Completed"
                                        : "Mark Pending"}
                                </button>

                                {editingId === task._id ? (
                                    <button
                                        onClick={() => updateTask(task._id)}
                                        className="text-green-400 hover:underline"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingId(task._id);
                                            setEditTitle(task.title);
                                        }}
                                        className="text-blue-400 hover:underline"
                                    >
                                        Edit
                                    </button>
                                )}

                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="text-red-400 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );

};

export default Dashboard;
