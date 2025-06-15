"use client";
import {API_URL} from "@/api/interceptor";
import OtpModal from "@/components/Modal/OtpModal";
import {registerUser} from "@/services/authservice.service";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import {signIn} from "next-auth/react";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const {t} = useLanguage();
  const {toast} = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setProfile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Instant preview
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {"image/*": []},
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let profileUrl = "";
    if (profile) {
      const formData = new FormData();
      formData.append("image", profile);
      try {
        const response = await axios.post(
          `${API_URL}/api/v1/images/file`,
          formData,
          {
            headers: {"Content-Type": "multipart/form-data"},
          }
        );
        profileUrl = `${API_URL}/api/v1/images/getImage?fileName=${response.data.payload}`;
      } catch (err) {
        toast({
          title: t("Error"),
          description: t("Image upload failed"),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    } else {
      profileUrl = "https://github.com/niccolo_eth.png"; // Default profile image
    }

    try {
      const res = await registerUser({
        username,
        password,
        email,
        profile: profileUrl,
      });

      if (res.status === 200) {
        setShowOtpModal(true); // Show OTP modal
      } else {
        toast({
          title: t("Error"),
          description: t("Registration failed"),
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: t("Error"),
        description: t("Registration error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (otp: string) => {
    setOtpLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/v1/admin/verified-otp`, {
        email,
        otp,
      });
      if (res.status === 200) {
        toast({
          title: t("Success"),
          description: t("Account verified! You can now log in."),
        });
        setShowOtpModal(false);
        router.push("/");
      } else {
        toast({
          title: t("Error"),
          description: t("Invalid OTP. Please try again."),
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: t("Error"),
        description: t("OTP verification failed."),
        variant: "destructive",
      });
    } finally {
      setOtpLoading(false);
    }
  };
  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google", {callbackUrl});
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Could not sign in with Google"),
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden">
        <div className="relative w-full">
          <div className="flex flex-col items-center w-full max-w-md gap-6 relative z-10">
            {/* Logo and Title */}
            <div className="flex flex-col items-center w-full">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary flex items-center justify-center bg-border">
                <Image
                  src="/assets/images/logo.jpg"
                  width={70}
                  height={70}
                  alt="TelePass Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-semibold">
                {t("Create Your TelePass Account")}
              </h1>
            </div>

            {/* Registration Card */}
            <Card className="w-full backdrop-blur-sm bg-card/80 border border-border/70 shadow-lg">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">{t("Username")}</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder={t("Enter your username")}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t("Email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={t("Enter your email")}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t("Password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={t("Create a password")}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile">{t("Profile Image")}</Label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer bg-background/60 hover:bg-background/80 transition-all ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}>
                      <input {...getInputProps()} id="profile" />{" "}
                      {previewUrl ? (
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            width={140}
                            height={140}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-muted-foreground">
                            {t("Drag & drop or click to select an image")}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {t("PNG, JPG, GIF up to 2MB")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>{" "}
                  <Button
                    type="submit"
                    className="w-full mt-2 bg-primary hover:bg-primary/90 transition-all"
                    disabled={loading}>
                    {loading ? t("Registering...") : t("Register")}
                  </Button>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 text-muted-foreground bg-card">
                        {t("Or register with")}
                      </span>
                    </div>
                  </div>{" "}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleGoogleSignUp}
                    disabled={googleLoading}>
                    {!googleLoading ? (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          xmlns="http://www.w3.org/2000/svg">
                          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path
                              fill="#4285F4"
                              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                            />
                            <path
                              fill="#34A853"
                              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                            />
                            <path
                              fill="#EA4335"
                              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                            />
                          </g>
                        </svg>
                        {t("Sign up with Google")}
                      </>
                    ) : (
                      t("Connecting to Google...")
                    )}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    {t("Already have an account?")}{" "}
                    <a href="/" className="text-primary hover:underline">
                      {t("Sign in")}
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <OtpModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        email={email}
        loading={otpLoading}
      />
    </>
  );
};

export default RegisterForm;
