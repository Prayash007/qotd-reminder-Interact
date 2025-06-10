
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  date: string;
  memberId: string;
  memberName: string;
  memberRole: 'junior' | 'senior';
  status: 'assigned' | 'completed' | 'missed';
}

interface Member {
  id: string;
  name: string;
  role: 'junior' | 'senior';
}

const AssignmentCalendar = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Mock data - will be replaced with Supabase queries
  const mockMembers: Member[] = [
    { id: '1', name: 'Prayash Sinha', role: 'senior' },
    { id: '2', name: 'John Doe', role: 'junior' },
    { id: '3', name: 'Jane Smith', role: 'senior' },
    { id: '4', name: 'Mike Johnson', role: 'junior' },
  ];

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      date: '2024-06-06',
      memberId: '1',
      memberName: 'Prayash Sinha',
      memberRole: 'senior',
      status: 'assigned'
    },
    {
      id: '2',
      date: '2024-06-10',
      memberId: '2',
      memberName: 'John Doe',
      memberRole: 'junior',
      status: 'completed'
    }
  ]);

  const getAssignmentForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return assignments.find(assignment => assignment.date === dateString);
  };

  const handleAssignMember = () => {
    if (!selectedDate || !selectedMember) {
      toast({
        title: "Error",
        description: "Please select both a date and a member",
        variant: "destructive",
      });
      return;
    }

    const member = mockMembers.find(m => m.id === selectedMember);
    if (!member) return;

    const dateString = selectedDate.toISOString().split('T')[0];
    const existingAssignment = assignments.find(a => a.date === dateString);

    if (existingAssignment) {
      toast({
        title: "Error",
        description: "This date already has an assignment",
        variant: "destructive",
      });
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      date: dateString,
      memberId: member.id,
      memberName: member.name,
      memberRole: member.role,
      status: 'assigned'
    };

    setAssignments([...assignments, newAssignment]);
    setShowAssignDialog(false);
    setSelectedMember("");

    toast({
      title: "Success",
      description: `Assigned ${member.name} to ${selectedDate.toLocaleDateString()}`,
    });
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const assignment = getAssignmentForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-border p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
            isToday ? 'bg-primary/10 border-primary' : ''
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="font-medium text-sm">{day}</div>
          {assignment && (
            <div className="mt-1">
              <div className="text-xs truncate font-medium">{assignment.memberName}</div>
              <Badge
                variant={assignment.memberRole === 'senior' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {assignment.memberRole}
              </Badge>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            QOTD Assignment Calendar
          </CardTitle>
          <CardDescription>
            Assign and manage Question of the Day responsibilities for club members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Select
                value={currentMonth.toString()}
                onValueChange={(value) => setCurrentMonth(parseInt(value))}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentYear.toString()}
                onValueChange={(value) => setCurrentYear(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign QOTD</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <div className="mt-2 p-3 border rounded-md bg-muted">
                      {selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="member">Select Member</Label>
                    <Select value={selectedMember} onValueChange={setSelectedMember}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a member" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {member.name}
                              <Badge variant={member.role === 'senior' ? 'default' : 'secondary'}>
                                {member.role}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAssignMember} className="flex-1">
                      Assign
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAssignDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center font-medium text-sm bg-muted">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendarGrid()}
          </div>

          {/* Selected Date Info */}
          {selectedDate && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">
                Selected: {selectedDate.toLocaleDateString()}
              </h3>
              {(() => {
                const assignment = getAssignmentForDate(selectedDate);
                return assignment ? (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{assignment.memberName}</span>
                    <Badge variant={assignment.memberRole === 'senior' ? 'default' : 'secondary'}>
                      {assignment.memberRole}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No assignment for this date</p>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentCalendar;
