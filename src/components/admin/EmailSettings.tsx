
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, Globe, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailSettings = () => {
  const { toast } = useToast();
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [newsApiKey, setNewsApiKey] = useState("");
  const [emailTemplate, setEmailTemplate] = useState(`Subject: Your QOTD Duty Today 🗓️

Hey {{memberName}},

This is a reminder that you're scheduled to post today's Question of the Day as a {{memberRole}}!

Date: {{date}}

Need inspiration? Check these articles:
{{newsLinks}}

Have fun crafting your post!

— Club QOTD Team`);

  const [testEmail, setTestEmail] = useState("");

  const handleSaveSettings = () => {
    console.log("Saving email settings:", {
      emailEnabled,
      reminderTime,
      newsApiKey,
      emailTemplate
    });

    toast({
      title: "Settings Saved",
      description: "Email configuration has been updated successfully",
    });
  };

  const handleTestEmail = () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address to test",
        variant: "destructive",
      });
      return;
    }

    console.log("Sending test email to:", testEmail);
    
    toast({
      title: "Test Email Sent",
      description: `Test email has been sent to ${testEmail}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Email Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Status
          </CardTitle>
          <CardDescription>
            Current status and configuration of the email reminder system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Service Status</p>
                <p className="text-sm text-muted-foreground">Email reminders</p>
              </div>
              <Badge variant={emailEnabled ? "default" : "secondary"}>
                {emailEnabled ? "Active" : "Disabled"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Daily Schedule</p>
                <p className="text-sm text-muted-foreground">Reminder time</p>
              </div>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {reminderTime} IST
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">News API</p>
                <p className="text-sm text-muted-foreground">Article integration</p>
              </div>
              <Badge variant={newsApiKey ? "default" : "secondary"}>
                {newsApiKey ? "Connected" : "Not Set"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>
            Configure automated email reminders and news article integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-enabled">Enable Email Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Send daily reminders to assigned members
                </p>
              </div>
              <Switch
                id="email-enabled"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>

            <div>
              <Label htmlFor="reminder-time">Daily Reminder Time (IST)</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-[200px]"
              />
            </div>
          </div>

          {/* News API Configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="news-api">NewsAPI.org API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="news-api"
                  type="password"
                  placeholder="Enter your NewsAPI key"
                  value={newsApiKey}
                  onChange={(e) => setNewsApiKey(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Get your free API key from{" "}
                <a
                  href="https://newsapi.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  newsapi.org
                </a>
              </p>
            </div>
          </div>

          {/* Email Template */}
          <div>
            <Label htmlFor="email-template">Email Template</Label>
            <Textarea
              id="email-template"
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Available variables: memberName, memberRole, date, newsLinks
            </p>
          </div>

          <Button onClick={handleSaveSettings} className="w-full">
            Save Email Settings
          </Button>
        </CardContent>
      </Card>

      {/* Test Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Email System
          </CardTitle>
          <CardDescription>
            Send a test email to verify your configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              type="email"
            />
            <Button onClick={handleTestEmail}>
              Send Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSettings;
