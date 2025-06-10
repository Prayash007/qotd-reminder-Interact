import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Calendar, Settings, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import MemberManagement from "./MemberManagement";
import AssignmentCalendar from "./AssignmentCalendar";
import EmailSettings from "./EmailSettings";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'junior' | 'senior';
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'assignments' | 'email'>('overview');
  const { signOut } = useAuth();

  // Mock stats for now - will be replaced with real data
  const mockStats = {
    totalMembers: 12,
    assignmentsThisMonth: 25,
    upcomingReminders: 3,
    activeMembers: 10
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'members':
        return <MemberManagement />;
      case 'assignments':
        return <AssignmentCalendar />;
      case 'email':
        return <EmailSettings />;
      default:
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalMembers}</div>
                <p className="text-xs text-muted-foreground">Active club members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.assignmentsThisMonth}</div>
                <p className="text-xs text-muted-foreground">QOTD assignments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.upcomingReminders}</div>
                <p className="text-xs text-muted-foreground">Email reminders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((mockStats.activeMembers / mockStats.totalMembers) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Member engagement</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Badge variant="secondary">Admin</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'members' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('members')}
          >
            Members
          </Button>
          <Button
            variant={activeTab === 'assignments' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </Button>
          <Button
            variant={activeTab === 'email' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('email')}
          >
            Email Settings
          </Button>
        </div>

        {/* Content Area */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
