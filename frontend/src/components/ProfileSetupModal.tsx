import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { UserRole } from '../backend';

const LOGO_PATH = '/assets/Brown_Retro_Book_Store_Logo_20260224_180351_0000-removebg-preview.png';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending: isSaving } = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveProfile({
      id: BigInt(0),
      name: name.trim(),
      email: email.trim(),
      bio: bio.trim(),
      role: UserRole.user,
      followedUsers: [],
      profilePicture: undefined,
    });
  };

  return (
    <Dialog open={showProfileSetup} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <img
              src={LOGO_PATH}
              alt="Lit~Heaven open book logo"
              className="h-16 w-auto"
            />
          </div>
          <DialogTitle className="font-serif text-2xl text-center">Welcome to Lit~Heaven</DialogTitle>
          <DialogDescription className="text-center">Please set up your profile to continue</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSaving || !name.trim()}>
            {isSaving ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
