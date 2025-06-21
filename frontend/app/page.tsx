'use client'; // Required for client-side interactivity in Next.js

import { useState, useEffect } from 'react';

// Define Direction interface
interface Direction {
  id: number;
  name: string;
  semesters_count: number;
  credits_per_semester: number;
}

// Define form data for creating a direction
interface DirectionFormData {
  name: string;
  semesters_count: number;
  credits_per_semester: number;
}

export default function DirectionsPage() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<DirectionFormData>({
    name: '',
    semesters_count: 1,
    credits_per_semester: 24,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch directions from Django API
  const fetchDirections = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/directions/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Replace with real auth token (e.g., from localStorage or auth context)
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include', // For session-based auth (Django session)
      });
      if (!res.ok) {
        throw new Error('Failed to fetch directions');
      }
      const data: Direction[] = await res.json();
      setDirections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for adding a direction
  const handleAddDirection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/directions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          credentials: 'include',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Failed to create direction');
      }
      await fetchDirections(); // Refresh directions list
      setIsModalOpen(false); // Close modal
      setFormData({ name: '', semesters_count: 1, credits_per_semester: 24 }); // Reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Filter directions based on search input
  const filteredDirections = directions.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : parseInt(value) || 0,
    }));
  };

  // Open/close modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setError(null); // Clear errors when opening modal
  };

  useEffect(() => {
    fetchDirections();
  }, []);

  return (
      <div className="container mx-auto p-4">
        {/* Search and Action Buttons */}
        <div className="flex justify-between mb-4">
          <input
              type="text"
              placeholder="Search directions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="space-x-2">
            <button
                onClick={toggleModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Direction
            </button>
            {/* TODO: Add buttons for User, Subject, Event */}
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Add User
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600">
              Add Subject
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
              Add Event
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
        )}

        {/* Loading State */}
        {loading && (
            <div className="text-center text-gray-500">Loading directions...</div>
        )}

        {/* Direction Cards */}
        {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredDirections.length > 0 ? (
                  filteredDirections.map((direction) => (
                      <div
                          key={direction.id}
                          className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
                      >
                        <h2 className="text-xl font-bold text-gray-800">{direction.name}</h2>
                        <p className="text-gray-600">Semesters: {direction.semesters_count}</p>
                        <p className="text-gray-600">Credits/Semester: {direction.credits_per_semester}</p>
                        <a
                            href={`/admin/directions/${direction.id}`}
                            className="text-blue-500 hover:underline"
                        >
                          View Details
                        </a>
                      </div>
                  ))
              ) : (
                  <div className="text-gray-500">No directions found.</div>
              )}
            </div>
        )}

        {/* Add Direction Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Add New Direction</h2>
                <form onSubmit={handleAddDirection}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">
                      Direction Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="semesters_count" className="block text-gray-700">
                      Number of Semesters
                    </label>
                    <input
                        type="number"
                        id="semesters_count"
                        name="semesters_count"
                        value={formData.semesters_count}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="credits_per_semester" className="block text-gray-700">
                      Credits per Semester
                    </label>
                    <input
                        type="number"
                        id="credits_per_semester"
                        name="credits_per_semester"
                        value={formData.credits_per_semester}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                  </div>
                  {error && (
                      <div className="text-red-700 mb-4">{error}</div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={toggleModal}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}