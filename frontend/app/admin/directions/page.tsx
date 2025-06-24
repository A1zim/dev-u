'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Modal from '../../../components/Modal';

interface Direction {
    id: number;
    name: string;
    semesters: number;
}

interface ErrorResponse {
    detail?: string;
    name?: string[];
    semesters?: string[];
}

const columnHelper = createColumnHelper<Direction>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Direction Name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('semesters', {
        header: 'Semesters',
        cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <button
                onClick={() => window.location.href = `/admin/directions/${row.original.id}/semesters`} // Navigate to semesters
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                aria-label={`Open ${row.original.name}`}
            >
                Open
            </button>
        ),
    }),
];

export default function DirectionsPage() {
    const [directions, setDirections] = useState<Direction[]>([]);
    const [search, setSearch] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isAddDirectionModalOpen, setIsAddDirectionModalOpen] = useState<boolean>(false);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
    const [newDirection, setNewDirection] = useState<{ name: string; semesters: number }>({ name: '', semesters: 0 });
    const [formErrors, setFormErrors] = useState<{ name?: string; semesters?: string }>({});
    const [newEvent, setNewEvent] = useState<{ title: string; description: string; date: string }>({ title: '', description: '', date: '' });
    const router = useRouter();

    // Fetch directions
    useEffect(() => {
        const fetchDirections = async () => {
            try {
                console.log('Fetching directions...'); // Debug
                const response = await api.get<Direction[]>('/directions/');
                console.log('Directions fetched:', response.data); // Debug
                setDirections(response.data);
            } catch (err: any) {
                console.error('Fetch directions error:', err.response?.data); // Debug
                setError(err.response?.data?.detail || 'Failed to fetch directions.');
                if (err.response?.status === 401) {
                    router.push('/login');
                }
            }
        };
        fetchDirections();
    }, [router]);

    // Validate form
    const validateDirectionForm = () => {
        const errors: { name?: string; semesters?: string } = {};
        if (!newDirection.name.trim()) {
            errors.name = 'Direction name is required.';
        }
        if (newDirection.semesters <= 0) {
            errors.semesters = 'Semesters must be a positive number.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle add direction
    const handleAddDirection = async () => {
        if (!validateDirectionForm()) {
            return;
        }

        try {
            console.log('Adding direction:', newDirection); // Debug
            const response = await api.post<Direction>('/directions/', newDirection);
            console.log('Direction added:', response.data); // Debug
            setDirections([...directions, response.data]);
            setIsAddDirectionModalOpen(false);
            setNewDirection({ name: '', semesters: 0 });
            setFormErrors({});
            setError('');
        } catch (err: any) {
            console.error('Add direction error:', err.response?.data); // Debug
            const errorResponse = err.response?.data as ErrorResponse;
            if (errorResponse.name) {
                setFormErrors({ name: errorResponse.name.join(' ') });
            } else if (errorResponse.semesters) {
                setFormErrors({ semesters: errorResponse.semesters.join(' ') });
            } else {
                setError(errorResponse?.detail || 'Failed to add direction.');
            }
            if (err.response?.status === 401) {
                router.push('/login');
            }
        }
    };

    // Handle add event
    const handleAddEvent = async () => {
        try {
            console.log('Adding event:', newEvent); // Debug
            await api.post('/events/', newEvent);
            console.log('Event added successfully'); // Debug
            setIsAddEventModalOpen(false);
            setNewEvent({ title: '', description: '', date: '' });
            setError('');
        } catch (err: any) {
            console.error('Add event error:', err.response?.data); // Debug
            setError(err.response?.data?.detail || 'Failed to add event.');
            if (err.response?.status === 401) {
                router.push('/login');
            }
        }
    };

    // Handle search
    const handleSearch = async () => {
        try {
            console.log('Searching directions with query:', search); // Debug
            const response = await api.get<Direction[]>('/directions/', {
                params: { search: search.trim() },
            });
            console.log('Search results:', response.data); // Debug
            setDirections(response.data);
            setError('');
        } catch (err: any) {
            console.error('Search error:', err.response?.data); // Debug
            setError(err.response?.data?.detail || 'Failed to search directions.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Directions</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Search Bar */}
                <div className="mb-4 flex items-center space-x-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search directions..."
                        className="border border-gray-300 rounded p-2 flex-1"
                        aria-label="Search directions"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        aria-label="Search"
                    >
                        Search
                    </button>
                </div>

                {/* Directions Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 overflow-x-auto">
                    {directions.map((direction) => (
                        <div
                            key={direction.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 min-w-[250px]"
                            role="region"
                            aria-label={`Direction: ${direction.name}`}
                        >
                            <h2 className="text-lg font-medium">{direction.name}</h2>
                            <p className="text-gray-600">{direction.semesters} semesters</p>
                            <button
                                onClick={() => router.push(`/admin/directions/${direction.id}/semesters`)}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                aria-label={`Open ${direction.name}`}
                            >
                                Open
                            </button>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <button
                        onClick={() => setIsAddDirectionModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        aria-label="Add new direction"
                    >
                        Add Direction
                    </button>
                    <button
                        onClick={() => setIsAddEventModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        aria-label="Add new event"
                    >
                        Add Event
                    </button>
                    <button>
                        Add User
                    </button>
                    <button>
                        Add Subject
                    </button>
                </div>

                {/* Add Direction Modal */}
                <Modal
                    isOpen={isAddDirectionModalOpen}
                    onClose={() => {
                        setIsAddDirectionModalOpen(false);
                        setFormErrors({});
                        setNewDirection({ name: '', semesters: 0 });
                    }}
                    title="Add New Direction"
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="direction-name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="direction-name"
                                type="text"
                                value={newDirection.name}
                                onChange={(e) => setNewDirection({ ...newDirection, name: e.target.value })}
                                className={`mt-1 w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter direction name"
                                aria-required="true"
                                aria-invalid={!!formErrors.name}
                                aria-describedby={formErrors.name ? 'name-error' : undefined}
                            />
                            {formErrors.name && (
                                <p id="name-error" className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="direction-semesters" className="block text-sm font-medium text-gray-700">
                                Semesters
                            </label>
                            <input
                                id="direction-semesters"
                                type="number"
                                value={newDirection.semesters}
                                onChange={(e) => setNewDirection({ ...newDirection, semesters: parseInt(e.target.value) || 0 })}
                                className={`mt-1 w-full p-2 border rounded ${formErrors.semesters ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter number of semesters"
                                aria-required="true"
                                aria-invalid={!!formErrors.semesters}
                                aria-describedby={formErrors.semesters ? 'semesters-error' : undefined}
                            />
                            {formErrors.semesters && (
                                <p id="semesters-error" className="text-red-500 text-sm mt-1">{formErrors.semesters}</p>
                            )}
                        </div>
                        <button
                            onClick={handleAddDirection}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                            aria-label="Save new direction"
                        >
                            Save
                        </button>
                    </div>
                </Modal>

                {/* Add Event Modal */}
                <Modal
                    isOpen={isAddEventModalOpen}
                    onClose={() => {
                        setIsAddEventModalOpen(false);
                        setNewEvent({ title: '', description: '', date: '' });
                    }}
                    title="Add New Event"
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="event-title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                id="event-title"
                                type="text"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter event title"
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="event-description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="event-description"
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter event description"
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="event-date" className="block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <input
                                id="event-date"
                                type="date"
                                value={newEvent.date}
                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                aria-required="true"
                            />
                        </div>
                        <button
                            onClick={handleAddEvent}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                            aria-label="Save new event"
                        >
                            Save
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}