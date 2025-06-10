
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Mail, Shield } from "lucide-react";
import AuthDialog from "@/components/auth/AuthDialog";
import AdminDashboard from "@/components/admin/AdminDashboard";
import MemberDashboard from "@/components/member/MemberDashboard";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show appropriate dashboard
  if (user && profile) {
    if (profile.role === 'admin') {
      return <AdminDashboard user={{ ...user, ...profile }} onLogout={() => {}} />;
    } else {
      return <MemberDashboard user={{ ...user, ...profile }} onLogout={() => {}} />;
    }
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Club QOTD Manager</h1>
          </div>
          
          <Button onClick={() => setShowAuthDialog(true)}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Streamline Your Club's Question of the Day
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automate member assignments, send daily reminders, and keep your club engaged 
            with our comprehensive QOTD management system.
          </p>
          <Button size="lg" onClick={() => setShowAuthDialog(true)}>
            Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Member Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easily manage club members, assign roles, and track participation 
                across your organization.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Smart Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated rotation system ensures fair distribution of QOTD 
                responsibilities among all members.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Daily email notifications with curated news articles to inspire 
                engaging questions from your members.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Admin Features */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>
              Comprehensive control panel for club administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Bulk member assignment with rotation scheduling</li>
              <li>• Email template customization and NewsAPI integration</li>
              <li>• Calendar view for assignment tracking</li>
              <li>• Member role management and statistics</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
      />
    </div>
  );
};

export default Index;
