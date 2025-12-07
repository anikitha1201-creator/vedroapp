
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold font-headline text-primary mb-8 text-center text-ink-fade">
        Settings
      </h1>
      <div className="max-w-2xl mx-auto space-y-8 animate-[ink-fade-in_1s_ease-out_0.5s_forwards] opacity-0">
        <Card className="torch-flicker">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield/> Security</CardTitle>
            <CardDescription>Manage your password and account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        <Card className="torch-flicker">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
            <CardDescription>Choose how you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and content.</p>
              </div>
              <Switch />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                  <Label>In-App Sounds</Label>
                  <p className="text-sm text-muted-foreground">Enable sound effects for games and interactions.</p>
              </div>
              <Switch defaultChecked/>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive torch-flicker">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><Trash2/> Danger Zone</CardTitle>
            <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
          </CardHeader>
          <CardContent>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
