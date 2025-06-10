
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Shuffle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  role: 'junior' | 'senior';
}

interface BulkAssignmentProps {
  onAssignmentsGenerated: (assignments: Array<{ date: string; memberId: string; memberName: string; memberRole: 'junior' | 'senior' }>) => void;
}

const BulkAssignment = ({ onAssignmentsGenerated }: BulkAssignmentProps) => {
  const { toast } = useToast();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Mock data - will be replaced with Supabase queries
  const mockMembers: Member[] = [
    { id: '1', name: 'Prayash Sinha', role: 'senior' },
    { id: '2', name: 'John Doe', role: 'junior' },
    { id: '3', name: 'Jane Smith', role: 'senior' },
    { id: '4', name: 'Mike Johnson', role: 'junior' },
    { id: '5', name: 'Sarah Wilson', role: 'junior' },
    { id: '6', name: 'David Brown', role: 'senior' },
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const generateRotationSchedule = () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one member",
        variant: "destructive",
      });
      return;
    }

    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const selectedMemberObjects = mockMembers.filter(m => selectedMembers.includes(m.id));
    const assignments = [];

    // Generate rotation for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const memberIndex = (day - 1) % selectedMemberObjects.length;
      const member = selectedMemberObjects[memberIndex];
      const date = new Date(year, month, day);
      
      assignments.push({
        date: date.toISOString().split('T')[0],
        memberId: member.id,
        memberName: member.name,
        memberRole: member.role
      });
    }

    onAssignmentsGenerated(assignments);
    
    toast({
      title: "Success",
      description: `Generated rotation schedule for ${monthNames[month]} ${year} with ${selectedMembers.length} members`,
    });
  };

  const selectAllMembers = () => {
    setSelectedMembers(mockMembers.map(m => m.id));
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="h-5 w-5" />
          Bulk Member Assignment
        </CardTitle>
        <CardDescription>
          Select members and generate a rotating schedule for the entire month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Month and Year Selection */}
        <div className="flex gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
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
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
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
        </div>

        {/* Member Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium">Select Members for Rotation</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllMembers}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  id={member.id}
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleMemberToggle(member.id)}
                />
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <label htmlFor={member.id} className="font-medium cursor-pointer">
                    {member.name}
                  </label>
                </div>
                <Badge variant={member.role === 'senior' ? 'default' : 'secondary'}>
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {selectedMembers.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Rotation Preview:</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.min(10, new Date(parseInt(selectedYear), parseInt(selectedMonth) + 1, 0).getDate()) }).map((_, index) => {
                const memberIndex = index % selectedMembers.length;
                const member = mockMembers.find(m => m.id === selectedMembers[memberIndex]);
                return (
                  <Badge key={index} variant="outline">
                    Day {index + 1}: {member?.name}
                  </Badge>
                );
              })}
              {new Date(parseInt(selectedYear), parseInt(selectedMonth) + 1, 0).getDate() > 10 && (
                <Badge variant="outline">...</Badge>
              )}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button 
          onClick={generateRotationSchedule}
          className="w-full"
          disabled={selectedMembers.length === 0}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Generate Rotation Schedule
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkAssignment;
