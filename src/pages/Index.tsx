
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthDialog from "@/components/auth/AuthDialog";
import AdminDashboard from "@/components/admin/AdminDashboard";
import MemberDashboard from "@/components/member/MemberDashboard";
import { Calendar, Users, Mail, Shield } from "lucide-react";

// Mock user type for now - will be replaced with Supabase auth
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'junior' | 'senior';
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Mock authentication - will be replaced with Supabase auth
  const mockLogin = (email: string, name: string, role: 'junior' | 'senior') => {
    const isAdmin = email === "sinhaprayash79@gmail.com";
    setUser({
      id: Math.random().toString(),
      email,
      name,
      role: isAdmin ? 'admin' : role
    });
  };

  const logout = () => {
    setUser(null);
  };

  if (user) {
    return user.role === 'admin' ? (
      <AdminDashboard user={user} onLogout={logout} />
    ) : (
      <MemberDashboard user={user} onLogout={logout} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Club QOTD Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your club's Question of the Day assignments with automated reminders and member management
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Easily assign QOTD dates to members with our intuitive calendar interface
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Auto Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Daily 8 AM IST email reminders with curated news article suggestions
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Member Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Organize junior and senior members with role-based access
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Admin Control</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Comprehensive admin dashboard for complete system management
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Join your club and start managing QOTD assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowAuthDialog(true)}
                className="w-full"
                size="lg"
              >
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>

        <AuthDialog 
          isOpen={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          onLogin={mockLogin}
        />
      </div>
    </div>
  );
};

export default Index;
