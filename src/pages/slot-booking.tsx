import { Ban, CheckCircle, ChevronLeft, ChevronRight, Clock, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';

const SlotManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 7));
  const [selectedDate, setSelectedDate] = useState(7);
  const [slotData, setSlotData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [comment, setComment] = useState('');

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM'
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    return days;
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const getSlotKey = (slot) => `${currentDate.getMonth()}-${selectedDate}-${slot}`;

  const openBlockModal = (slot) => {
    const key = getSlotKey(slot);
    setCurrentSlot(slot);
    setComment(slotData[key]?.comment || '');
    setModalOpen(true);
  };

  const handleBlock = () => {
    const key = getSlotKey(currentSlot);
    setSlotData(prev => ({
      ...prev,
      [key]: { blocked: true, comment: comment.trim() }
    }));
    setModalOpen(false);
    setComment('');
  };

  const handleUnblock = (slot) => {
    const key = getSlotKey(slot);
    setSlotData(prev => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  const getSlotStatus = (slot) => {
    const key = getSlotKey(slot);
    return slotData[key];
  };

  const days = getDaysInMonth(currentDate);
  const blockedCount = Object.keys(slotData).filter(key => 
    key.startsWith(`${currentDate.getMonth()}-${selectedDate}-`)
  ).length;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'hsl(35 30% 98%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'hsl(25 15% 15%)' }}>
            Time Slot Management
          </h1>
          <p className="text-base" style={{ color: 'hsl(25 10% 45%)' }}>
            Manage and block appointment slots with custom notifications
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-4" style={{ boxShadow: '0 2px 8px hsl(25 20% 15% / 0.08)' }}>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 rounded-full border-2 transition-all hover:scale-105"
                  style={{ 
                    borderColor: 'hsl(25 100% 60%)',
                    color: 'hsl(25 100% 60%)'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <h2 className="text-xl font-semibold" style={{ color: 'hsl(25 15% 15%)' }}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-full border-2 transition-all hover:scale-105"
                  style={{ 
                    borderColor: 'hsl(25 100% 60%)',
                    color: 'hsl(25 100% 60%)'
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-3">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-medium py-2" style={{ color: 'hsl(25 10% 45%)' }}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((dateObj, idx) => (
                  <button
                    key={idx}
                    onClick={() => dateObj.isCurrentMonth && setSelectedDate(dateObj.day)}
                    disabled={!dateObj.isCurrentMonth}
                    className="aspect-square rounded-xl text-sm text-center transition-all hover:scale-105"
                    style={{
                      color: !dateObj.isCurrentMonth ? 'hsl(25 10% 75%)' : 
                             selectedDate === dateObj.day ? 'white' :
                             dateObj.day === 7 ? 'hsl(25 100% 60%)' : 'hsl(25 15% 15%)',
                      background: selectedDate === dateObj.day ? 'hsl(25 100% 60%)' :
                                 dateObj.day === 7 && selectedDate !== 7 ? 'hsl(45 100% 90%)' : 'transparent',
                      fontWeight: dateObj.day === 7 || selectedDate === dateObj.day ? '600' : '400',
                      cursor: !dateObj.isCurrentMonth ? 'default' : 'pointer'
                    }}
                  >
                    {dateObj.day}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 p-4 rounded-xl" style={{ background: 'hsl(35 25% 94%)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'hsl(25 15% 15%)' }}>
                    Selected Date
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'hsl(25 100% 60%)' }}>
                    {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'hsl(25 15% 15%)' }}>
                    Blocked Slots
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'hsl(0 84% 60%)' }}>
                    {blockedCount} / {timeSlots.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 8px hsl(25 20% 15% / 0.08)' }}>
              <div className="flex items-center gap-2 mb-6">
                <Clock size={24} style={{ color: 'hsl(25 100% 60%)' }} />
                <h3 className="text-xl font-semibold" style={{ color: 'hsl(25 15% 15%)' }}>
                  Available Time Slots
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeSlots.map((slot) => {
                  const status = getSlotStatus(slot);
                  const isBlocked = status?.blocked;
                  
                  return (
                    <div
                      key={slot}
                      className="rounded-xl overflow-hidden transition-all"
                      style={{
                        border: isBlocked ? '2px solid hsl(0 84% 60%)' : '2px solid hsl(35 20% 88%)',
                        background: isBlocked ? 'hsl(0 84% 98%)' : 'white'
                      }}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-lg" style={{ color: 'hsl(25 15% 15%)' }}>
                            {slot}
                          </span>
                          {isBlocked ? (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                                 style={{ background: 'hsl(0 84% 60%)', color: 'white' }}>
                              <Ban size={12} />
                              <span>Blocked</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                                 style={{ background: 'hsl(120 60% 90%)', color: 'hsl(120 60% 30%)' }}>
                              <CheckCircle size={12} />
                              <span>Available</span>
                            </div>
                          )}
                        </div>
                        
                        {isBlocked && status.comment && (
                          <div className="mb-3 p-2 rounded-lg flex items-start gap-2"
                               style={{ background: 'hsl(35 25% 94%)' }}>
                            <MessageSquare size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'hsl(25 100% 60%)' }} />
                            <p className="text-xs" style={{ color: 'hsl(25 10% 35%)' }}>
                              {status.comment}
                            </p>
                          </div>
                        )}
                        
                        <button
                          onClick={() => isBlocked ? handleUnblock(slot) : openBlockModal(slot)}
                          className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all hover:scale-105"
                          style={{
                            background: isBlocked ? 'hsl(120 60% 50%)' : 'hsl(25 100% 60%)',
                            color: 'white'
                          }}
                        >
                          {isBlocked ? 'Unblock Slot' : 'Block Slot'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Block Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6" style={{ boxShadow: '0 8px 24px hsl(25 20% 15% / 0.12)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: 'hsl(25 15% 15%)' }}>
                Block Time Slot
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} style={{ color: 'hsl(25 10% 45%)' }} />
              </button>
            </div>
            
            <div className="mb-4 p-3 rounded-lg" style={{ background: 'hsl(35 25% 94%)' }}>
              <p className="text-sm mb-1" style={{ color: 'hsl(25 10% 45%)' }}>Time Slot</p>
              <p className="font-semibold text-lg" style={{ color: 'hsl(25 15% 15%)' }}>
                {currentSlot}
              </p>
              <p className="text-sm mt-1" style={{ color: 'hsl(25 10% 45%)' }}>
                {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(25 15% 15%)' }}>
                Reason for blocking (visible to users)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g., Doctor not available, Emergency leave, Holiday"
                rows="4"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
                style={{
                  borderColor: 'hsl(35 20% 88%)',
                  color: 'hsl(25 15% 15%)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'hsl(25 100% 60%)'}
                onBlur={(e) => e.target.style.borderColor = 'hsl(35 20% 88%)'}
              />
              <p className="text-xs mt-1" style={{ color: 'hsl(25 10% 45%)' }}>
                This message will be displayed to users when they try to book this slot.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  background: 'hsl(35 25% 94%)',
                  color: 'hsl(25 15% 15%)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBlock}
                className="flex-1 py-3 px-4 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  background: 'hsl(0 84% 60%)',
                  color: 'white'
                }}
              >
                Block Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManagement;