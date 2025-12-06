import PageWrapper from '@/components/page-wrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookCopy, Edit, FlaskConical, Gamepad2, Medal, Puzzle, User } from 'lucide-react';

const badges = [
  { icon: <BookCopy />, name: 'First Chapter', description: 'Completed your first lesson.' },
  { icon: <Puzzle />, name: 'Concept Apprentice', description: 'Won 5 Concept Builder games.' },
  { icon: <FlaskConical />, name: 'Junior Alchemist', description: 'Performed 10 experiments.' },
  { icon: <Gamepad2 />, name: 'Quiz Runner', description: 'Scored 1000 points in Running Quiz.' },
];

const gameHistory = [
    { icon: <Puzzle />, name: 'Photosynthesis Concept', score: 'Completed', date: '2 days ago' },
    { icon: <Gamepad2 />, name: 'Chemistry Quiz', score: '1250 pts', date: '3 days ago' },
    { icon: <FlaskConical />, name: 'Acid-Base Neutralization', score: 'Viewed Explanation', date: '4 days ago' },
];


export default function ProfilePage() {
  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold font-headline text-primary mb-8 text-center text-ink-fade">
        Your Scholar Profile
      </h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col items-center space-y-4">
          <Card className="w-full text-center torch-flicker">
            <CardHeader>
                <Avatar className="h-24 w-24 mx-auto border-4 border-accent">
                    <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" />
                    <AvatarFallback><User size={48}/></AvatarFallback>
                </Avatar>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-2xl">Scholar Alex</CardTitle>
                <CardDescription>alex.scholar@ancient-academy.edu</CardDescription>
                <Button variant="outline" size="sm" className="mt-4 wax-press"><Edit size={14}/> Edit Profile</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
           <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-primary/5">
                    <TabsTrigger value="history">Game History</TabsTrigger>
                    <TabsTrigger value="badges">Badges</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest scholarly pursuits.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {gameHistory.map((item, index) => (
                               <div key={index} className="flex items-center justify-between p-3 rounded-md bg-background/50">
                                   <div className="flex items-center gap-4">
                                       <div className="text-accent">{item.icon}</div>
                                       <div>
                                           <p className="font-semibold">{item.name}</p>
                                           <p className="text-sm text-muted-foreground">{item.score}</p>
                                       </div>
                                   </div>
                                    <p className="text-sm text-muted-foreground">{item.date}</p>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="badges">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Accolades</CardTitle>
                            <CardDescription>Honors earned through your dedication to learning.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                            {badges.map((badge, index) => (
                                <div key={index} className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex flex-col items-center gap-2">
                                    <div className="text-accent text-4xl">{badge.icon}</div>
                                    <p className="font-semibold text-sm">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                            <CardDescription>Manage your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue="Scholar Alex" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue="alex.scholar@ancient-academy.edu" />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label>Dark Theme</Label>
                                    <p className="text-sm text-muted-foreground">Toggle the ancient library aesthetic.</p>
                                </div>
                                <Switch defaultChecked disabled aria-readonly/>
                            </div>
                             <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
}
