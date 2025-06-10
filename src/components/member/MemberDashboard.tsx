
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'junior' | 'senior';
}

interface MemberDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Assignment {
  id: string;
  date: string;
  status: 'upcoming' | 'completed' | 'missed';
  daysUntil: number;
}

const MemberDashboard = ({ user, onLogout }: MemberDashboardProps) => {
  // Mock data - will be replaced with Supabase queries
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      date: '2024-06-15',
      status: 'upcoming',
      daysUntil: 5
    },
    {
      id: '2',
      date: '2024-06-01',
      status: 'completed',
      daysUntil: -9
    },
    {
      id: '3',
      date: '2024-05-20',
      status: 'missed',
      daysUntil: -21
    }
  ]);

  const upcomingAssignments = assignments.filter(a => a.status === 'upcoming').length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const missedAssignments = assignments.filter(a => a.status === 'missed').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'missed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'missed':
        return <Badge variant="destructive">Missed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Member Dashboard</h1>
            <Badge variant={user.role === 'senior' ? 'default' : 'secondary'}>
              {user.role}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAssignments}</div>
              <p className="text-xs text-muted-foreground">QOTD assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAssignments}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((completedAssignments / (completedAssignments + missedAssignments)) * 100) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Assignments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your QOTD Assignments</CardTitle>
            <CardDescription>
              Track your Question of the Day assignments and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Days Until/Since</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {new Date(assignment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(assignment.status)}
                          {getStatusBadge(assignment.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.daysUntil > 0 
                          ? `${assignment.daysUntil} days until`
                          : assignment.daysUntil === 0
                          ? 'Today'
                          : `${Math.abs(assignment.daysUntil)} days ago`
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        {assignment.status === 'upcoming' && (
                          <Button variant="outline" size="sm">
                            Mark Complete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Next Assignment Alert */}
        {upcomingAssignments > 0 && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Next Assignment Coming Up!</CardTitle>
              <CardDescription className="text-blue-700">
                You have a QOTD assignment scheduled for {assignments.find(a => a.status === 'upcoming')?.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                Don't forget to check your email at 8:00 AM IST for your daily reminder with article suggestions!
              </p>
              <Button variant="default" size="sm">
                View Assignment Details
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
