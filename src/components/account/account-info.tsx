"use client";

import {useState, useEffect} from "react";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {Separator} from "@/components/ui/separator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Key,
  Languages,
  MapPin,
  Calendar,
} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {toast} from "@/hooks/use-toast";
import {ScrollArea} from "@/components/ui/scroll-area";
import {getAdminByUsername} from "@/services/authservice.service";
import {getSession} from "next-auth/react";

export default function Account() {
  const {t} = useLanguage();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dynamic user data from API
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    role: "Administrator",
    bio: "",
    address: "",
    joinedDate: "",
    language: "en",
    timezone: "Asia/Phnom_Penh",
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const session = await getSession();

        if (session?.user?.username) {
          const adminResponse = await getAdminByUsername(session.user.username);

          if (adminResponse?.data) {
            const adminData = adminResponse.data;
            setUserData({
              name: adminData.username || "Unknown User",
              email: adminData.email || "",
              phone: adminData.phone || "",
              avatar: adminData.profile || "https://github.com/shadcn.png",
              role: "Administrator", // You can modify this based on API response
              bio: adminData.bio || "",
              address: adminData.address || "",
              joinedDate: adminData.createdAt
                ? new Date(adminData.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "",
              language: adminData.language || "en",
              timezone: adminData.timezone || "Asia/Phnom_Penh",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: t("Error"),
          description: t("Failed to load user data"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [t]);
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    // Basic validation
    if (!name || !email) {
      setIsPending(false);
      toast({
        title: t("Validation Error"),
        description: t("Name and email are required"),
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsPending(false);
      toast({
        title: t("Invalid Email"),
        description: t("Please enter a valid email address"),
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    try {
      // Here you would make the actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPending(false);
      toast({
        title: t("Profile Updated"),
        description: t(
          "Your profile information has been updated successfully."
        ),
        variant: "default",
      });

      // Update local state
      setUserData((prev) => ({
        ...prev,
        name,
        email,
      }));
    } catch (error) {
      setIsPending(false);
      toast({
        title: t("Update Failed"),
        description: t("Failed to update profile. Please try again."),
        variant: "destructive",
      });
    }
  };
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const currentPassword = formData.get("current-password") as string;
    const newPassword = formData.get("new-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setIsPending(false);
      toast({
        title: t("Validation Error"),
        description: t("All password fields are required"),
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsPending(false);
      toast({
        title: t("Password Mismatch"),
        description: t("New password and confirm password do not match"),
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      setIsPending(false);
      toast({
        title: t("Password Too Short"),
        description: t("Password must be at least 8 characters long"),
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    try {
      // Here you would make the actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsPending(false);
      toast({
        title: t("Password Updated"),
        description: t("Your password has been changed successfully."),
        variant: "default",
      });

      // Clear form
      form.reset();
    } catch (error) {
      setIsPending(false);
      toast({
        title: t("Update Failed"),
        description: t("Failed to update password. Please try again."),
        variant: "destructive",
      });
    }
  };
  return (
    <>
      <Tabs defaultValue="general" className="w-full">
        {" "}
        <ScrollArea className="w-full">
          <TabsList className="mb-8 w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary">
              <User className="mr-2 h-4 w-4" />
              {t("General")}
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary">
              <Key className="mr-2 h-4 w-4" />
              {t("Security")}
            </TabsTrigger>
          </TabsList>
        </ScrollArea>{" "}
        {/* General Tab */}{" "}
        <TabsContent value="general" className="w-full">
          <div className="grid gap-6 w-full">
            {/* Profile Information with Role information */}
            <Card className="w-full">
              {" "}
              <CardHeader>
                {" "}
                <div className="flex items-center justify-between">
                  <CardTitle>{t("Profile Information")}</CardTitle>{" "}
                  <Badge
                    className="text-sm px-3 py-1 font-medium bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-gradient-x text-white rounded-md"
                    variant="default">
                    <Shield className="mr-1.5 h-4 w-4" /> {t(userData.role)}
                  </Badge>
                </div>
                <CardDescription>
                  {t("Update your account profile information")}
                </CardDescription>
              </CardHeader>{" "}
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        {t("Loading profile...")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                      {" "}
                      <div className="grid gap-3">
                        <Label htmlFor="name">{t("Full Name")}</Label>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                          <Input
                            id="name"
                            name="name"
                            defaultValue={userData.name}
                            className="w-full"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="email">{t("Email")}</Label>
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={userData.email}
                            className="w-full"
                            required
                          />
                        </div>
                      </div>{" "}
                      {/* Removed Role section as it's now displayed as a badge near the avatar */}
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isPending}>
                        {isPending ? t("Saving...") : t("Save Changes")}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>{" "}
        {/* Security Tab */}{" "}
        <TabsContent value="security" className="w-full">
          <div className="grid gap-6 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{t("Change Password")}</CardTitle>
                <CardDescription>
                  {t("Update your password to keep your account secure")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-4">
                    {" "}
                    <div className="grid gap-3">
                      <Label htmlFor="current-password">
                        {t("Current Password")}
                      </Label>
                      <Input
                        id="current-password"
                        name="current-password"
                        type="password"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="new-password">{t("New Password")}</Label>
                      <Input
                        id="new-password"
                        name="new-password"
                        type="password"
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="confirm-password">
                        {t("Confirm New Password")}
                      </Label>
                      <Input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? t("Updating...") : t("Update Password")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
