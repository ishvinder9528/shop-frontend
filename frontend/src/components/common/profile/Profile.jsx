import { useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserContext } from '../../../context/userContext';
import { updateUser } from '@/services/userService';
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        picture: user.picture || avatarUrls[0],
    });
    const { toast } = useToast();
    
    const avatarUrls = [
        user?.picture,
        "https://avatar.iran.liara.run/public/16",
        "https://avatar.iran.liara.run/public/43",
        "https://avatar.iran.liara.run/public/17",
        "https://avatar.iran.liara.run/public/9",
        "https://avatar.iran.liara.run/public/38",
        "https://avatar.iran.liara.run/public/78",
        "https://avatar.iran.liara.run/public/100",
        "https://avatar.iran.liara.run/public/55",
        "https://avatar.iran.liara.run/public/73"
    ];
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser(user.googleId, formData);
      setUser(updatedUser);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="md:w-[550px]">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {avatarUrls.map((url, index) => (
                <Avatar
                  key={index}
                  className={`cursor-pointer transition-all ${formData.picture === url ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => setFormData({ ...formData, picture: url })}
                >
                  <AvatarImage src={url} alt={`Avatar option ${index + 1}`} />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex justify-center mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.picture} alt="Selected avatar" />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 