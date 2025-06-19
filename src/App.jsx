import React, { useState} from 'react';
import { ChevronLeft, ChevronRight, Clock, CalendarDays, AlertCircle } from 'lucide-react';

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Static events data as per assignment requirements
  const events = [
    {
      id: 1,
      title: "Team Meeting",
      date: "2025-06-20",
      time: "09:00",
      duration: 60,
      color: "#3B82F6"
    },
    {
      id: 2,
      title: "Project Deadline",
      date: "2025-06-25",
      time: "17:00",
      duration: 30,
      color: "#EF4444"
    },
    {
      id: 3,
      title: "Client Presentation",
      date: "2025-06-22",
      time: "14:00",
      duration: 90,
      color: "#10B981"
    },
    {
      id: 4,
      title: "Code Review",
      date: "2025-06-20",
      time: "11:00",
      duration: 45,
      color: "#F59E0B"
    },
    {
      id: 5,
      title: "Sprint Planning",
      date: "2025-06-23",
      time: "10:00",
      duration: 120,
      color: "#8B5CF6"
    },
    {
      id: 6,
      title: "Lunch Meeting",
      date: "2025-06-22",
      time: "12:30",
      duration: 60,
      color: "#06B6D4"
    },
    {
      id: 7,
      title: "Workshop",
      date: "2025-06-19",
      time: "15:00",
      duration: 180,
      color: "#EC4899"
    }
  ];

  const today = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Helper functions
  const isToday = (day) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const formatDateKey = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (day) => {
    const dateKey = formatDateKey(day);
    return events.filter(event => event.date === dateKey);
  };

  const hasTimeConflict = (events) => {
    if (events.length <= 1) return false;
    
    const sortedEvents = events.sort((a, b) => a.time.localeCompare(b.time));
    
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const current = sortedEvents[i];
      const next = sortedEvents[i + 1];
      
      const currentEnd = addMinutesToTime(current.time, current.duration);
      if (next.time < currentEnd) {
        return true;
      }
    }
    return false;
  };

  const addMinutesToTime = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleDateClick = (day) => {
    const dateEvents = getEventsForDate(day);
    if (dateEvents.length > 0) {
      setSelectedDate({ day, events: dateEvents });
      setShowEventDetails(true);
    }
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <CalendarDays className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Today
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <h2 className="text-2xl font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h2>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="h-24"></div>;
                }
                
                const dayEvents = getEventsForDate(day);
                const hasConflicts = hasTimeConflict(dayEvents);
                
                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      h-24 border-2 rounded-lg p-2 cursor-pointer transition-all duration-200 hover:shadow-md
                      ${isToday(day) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                      ${dayEvents.length > 0 ? 'hover:bg-gray-50' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`
                        text-sm font-medium
                        ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}
                      `}>
                        {day}
                      </span>
                      {hasConflicts && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs px-1 py-0.5 rounded truncate text-white font-medium"
                          style={{ backgroundColor: event.color }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {showEventDetails && selectedDate ? `Events for ${monthNames[month]} ${selectedDate.day}` : 'Upcoming Events'}
            </h3>
            
            <div className="space-y-3">
              {showEventDetails && selectedDate ? (
                selectedDate.events.map((event) => (
                  <div key={event.id} className="border-l-4 pl-3 py-2" style={{ borderColor: event.color }}>
                    <div className="font-medium text-gray-800">{event.title}</div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(event.time)} ({event.duration} min)
                    </div>
                  </div>
                ))
              ) : (
                events
                  .filter(event => new Date(event.date) >= today)
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className="border-l-4 pl-3 py-2" style={{ borderColor: event.color }}>
                      <div className="font-medium text-gray-800">{event.title}</div>
                      <div className="text-sm text-gray-600">{event.date}</div>
                      <div className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(event.time)} ({event.duration} min)
                      </div>
                    </div>
                  ))
              )}
            </div>
            
            {showEventDetails && (
              <button
                onClick={() => setShowEventDetails(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Back to Upcoming Events
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;