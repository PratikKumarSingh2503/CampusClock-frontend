import React, { useState, useEffect } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import API from "../utils/api";
import { toast } from "react-hot-toast";
import {
  Plus,
  Loader2,
  X,
  Trash2,
  Edit2,
  Clock,
  Repeat,
  AlertCircle,
  Bell,
  Calendar as CalendarIcon,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

const localizer = momentLocalizer(moment);

const priorityColors = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

const priorityIcons = {
  high: <Bell className="h-4 w-4" />,
  medium: <Clock className="h-4 w-4" />,
  low: <Tag className="h-4 w-4" />,
};

const Calendar = () => {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateTime: "",
    priority: "low",
    color: "#3B82F6",
    repeat: "none",
  });

  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await API.get("/reminders");
      const formattedEvents = response.data.map((reminder) => ({
        id: reminder._id,
        title: reminder.title,
        start: new Date(reminder.dateTime),
        end: moment(reminder.dateTime).add(1, "hour").toDate(),
        description: reminder.description,
        priority: reminder.priority,
        color: reminder.color,
        repeat: reminder.repeat,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      toast.error("Failed to fetch reminders");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reminderData = {
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
      };

      if (selectedEvent) {
        await API.put(`/reminders/${selectedEvent.id}`, reminderData);
        toast.success("Reminder updated successfully");
      } else {
        await API.post("/reminders", reminderData);
        toast.success("Reminder created successfully");
      }

      setShowModal(false);
      setSelectedEvent(null);
      setFormData({
        title: "",
        description: "",
        dateTime: "",
        priority: "medium",
        color: "#3B82F6",
        repeat: "none",
      });
      fetchReminders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save reminder");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try {
        await API.delete(`/reminders/${id}`);
        toast.success("Reminder deleted successfully");
        fetchReminders();
      } catch (error) {
        toast.error("Failed to delete reminder");
      }
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color || priorityColors[event.priority],
        borderRadius: "0.5rem",
        opacity: 0.8,
        color: "#fff",
        border: "0",
        display: "block",
        padding: "0.5rem",
      },
    };
  };

  const CustomEvent = ({ event }) => (
    <div className="flex items-center gap-2">
      {priorityIcons[event.priority]}
      <span className="font-medium">{event.title}</span>
      {event.repeat !== "none" && <Repeat className="h-3 w-3 ml-auto" />}
    </div>
  );

  const CustomToolbar = (toolbar) => {
    const goToToday = () => {
      const today = new Date();
      setCurrentDate(today);
      toolbar.onNavigate("TODAY");
    };

    const goToBack = () => {
      const newDate = moment(currentDate).subtract(1, currentView).toDate();
      setCurrentDate(newDate);
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      const newDate = moment(currentDate).add(1, currentView).toDate();
      setCurrentDate(newDate);
      toolbar.onNavigate("NEXT");
    };

    const viewNames = {
      month: "Month",
      week: "Week",
      day: "Day",
      agenda: "Agenda",
    };

    const handleViewChange = (view) => {
      console.log("Changing view to:", view);
      setCurrentView(view);
      toolbar.onView(view);
    };

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium hover:bg-color2/50 rounded-lg transition-colors"
          >
            Today
          </button>
          <div className="flex items-center">
            <button
              onClick={goToBack}
              className="p-1.5 hover:bg-color2/50 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="p-1.5 hover:bg-color2/50 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-lg font-semibold">{toolbar.label}</h2>
        </div>

        <div className="flex p-1 items-center gap-1 border border-color2 rounded-lg">
          {Object.entries(viewNames).map(([view, label]) => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                toolbar.view === view
                  ? "bg-color2 font-semibold"
                  : "hover:bg-color2/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="mx-auto  animate-fade-in">
      <div className={`rounded-xl shadow-xl p-6 ${
          theme === "light"
            ? "bg-color1 border-dcolor3" : "bg-dcolor3 border-color2" 
        }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedEvent(null);
                setShowModal(true);
              }}
              className="hover:text-color2"
            >
              <CalendarIcon className="h-5 w-5" />
            </button>
            <span className="">Add Reminder</span>
          </div>
        </div>

        <div className="">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "calc(100vh - 200px)" }}
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEvent,
              toolbar: CustomToolbar,
            }}
            view={currentView}
            date={currentDate}
            onNavigate={(date) => {
              console.log("Calendar date changed to:", date);
              setCurrentDate(date);
            }}
            onView={(view) => {
              console.log("Calendar view changed to:", view);
              setCurrentView(view);
            }}
            popup
            selectable
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setFormData({
                title: event.title,
                description: event.description || "",
                dateTime: moment(event.start).format("YYYY-MM-DDTHH:mm"),
                priority: event.priority || "medium",
                color: event.color || "#3B82F6",
                repeat: event.repeat || "none",
              });
              setShowModal(true);
            }}
            onSelectSlot={({ start }) => {
              setSelectedEvent(null);
              setFormData({
                title: "",
                description: "",
                dateTime: moment(start).format("YYYY-MM-DDTHH:mm"),
                priority: "medium",
                color: "#3B82F6",
                repeat: "none",
              });
              setShowModal(true);
            }}
          />
        </div>

        {showModal && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-40">
            <div
              className={`rounded-xl p-6 w-full max-w-md animate-slide-in shadow-xl ${
                theme === "light"
                  ? "bg-color1 border-dcolor3"
                  : "dark:bg-gray-800 border-color2"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedEvent ? "Edit Reminder" : "Add Reminder"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedEvent(null);
                  }}
                  className="p-1 border border-color2 hover:bg-color2 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="reminder_title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="pl-2 w-full py-2 border rounded-xl shadow-sm"
                    required
                  />
                </div>

                <div>
                  <textarea
                    type="text"
                    name="reminder_description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="pl-2 w-full py-2 border rounded-xl shadow-sm"
                  />
                </div>

                <div>
                  <input
                    type="datetime-local"
                    name="date_time"
                    placeholder="Date & Time"
                    value={formData.dateTime}
                    onChange={(e) =>
                      setFormData({ ...formData, dateTime: e.target.value })
                    }
                    className="pl-2 w-full py-2 border rounded-xl shadow-sm"
                    required
                  />
                </div>

                <div>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="h-10 w-full rounded-full cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <label className="form-label">Priority</label>
                    <select
                      name="reminder_priority"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="pl-2 w-full py-2 border rounded-xl shadow-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="form-label">Repeat</label>
                    <select
                      name="reminder_repeat"
                      value={formData.repeat}
                      onChange={(e) =>
                        setFormData({ ...formData, repeat: e.target.value })
                      }
                      className="pl-2 w-full py-2 border rounded-xl shadow-sm"
                    >
                      <option value="none">None</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  {selectedEvent && (
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedEvent.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="submit"
                    //  className="btn btn-primary"
                    className="px-3 py-1 bg-yellow-500 text-white rounded transition-colors"
                  >
                    {selectedEvent ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
