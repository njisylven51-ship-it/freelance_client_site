import { useState } from "react";
import type { Profile } from "./types/profile";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const normalizeUrl = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return "https://" + url;
};

export default function FreelancerDashboard() {
  const defaultProfile: Profile = {
    name: "Your name",
    title: "Freelance Developer",
    location: "Your Country",
    about: "Write something about yourself...",
    email: "your email",
    skills: ["JavaScript", "React", "Node.js"],
    photo: "",
    socials: {
      github: "",
      linkedin: "",
      twitter: "",
      about: "",
    },
  };

  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem("profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [open, setOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState<Profile>(profile);

  const saveProfile = () => {
    setProfile(tempProfile);
    localStorage.setItem("profile", JSON.stringify(tempProfile));
    setOpen(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile({ ...tempProfile, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* PROFILE CARD */}
      <Card className="shadow-md border border-gray-200 rounded-xl p-2">
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {profile.photo ? (
              <img
                src={profile.photo}
                className="w-36 h-36 rounded-full object-cover shadow"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-300 shadow-inner" />
            )}
          </div>

          <div className="text-sm space-y-1">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Title:</strong> {profile.title}</p>
            <p><strong>Location:</strong> {profile.location}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>

          {/* About */}
          <div>
            <strong className="block mb-1">About:</strong>
            <p className="text-muted-foreground">{profile.about}</p>
          </div>

          {/* Skills */}
          <div>
            <strong className="block mb-1">Skills:</strong>
            <div className="flex gap-2 flex-wrap">
              {profile.skills.map((skill, i) => (
                <Badge key={i} className="shadow-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* SOCIALS WITH ICON LINKS */}
<div className="pt-2 space-y-3">
  {[
    ["github", faGithub],
    ["linkedin", faLinkedin],
    ["twitter", faTwitter],
  ].map(([key, icon]) => {
    const rawUrl = profile.socials[key as keyof typeof profile.socials];
    const url = normalizeUrl(rawUrl);

    return (
      <div key={key as string} className="flex items-center gap-3">
        
        {/* CLICKABLE ICON */}
        {rawUrl ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:text-blue-600"
          >
            <FontAwesomeIcon icon={icon as IconDefinition} className="text-xl" />
          </a>
        ) : (
          <FontAwesomeIcon icon={icon as IconDefinition} className="text-xl text-gray-400" />
        )}

        {/* URL TEXT */}
        {rawUrl ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {rawUrl}
          </a>
        ) : (
          <span className="text-gray-500">No {(key as string)} added</span>
        )}
      </div>
    );
  })}
</div>


          <Button onClick={() => { setTempProfile(profile); setOpen(true); }}>
            Edit Profile
          </Button>
        </CardContent>
      </Card>


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">

            <div className="flex flex-col items-center gap-3">
              {tempProfile.photo ? (
                <img
                  src={tempProfile.photo}
                  className="w-24 h-24 rounded-full object-cover shadow"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full shadow-inner" />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="border-gray-300 shadow-sm"
              />
            </div>


            {[
              ["name", "Full Name"],
              ["title", "Title"],
              ["location", "Location"],
              ["email", "Email"],
            ].map(([key, label]) => (
              <div key={key} className="space-y-1">
                <label className="text-sm font-medium">{label}</label>
                <Input
                  value={
                    tempProfile[
                      key as keyof Omit<Profile, "skills" | "photo" | "socials">
                    ] as string
                  }
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, [key]: e.target.value })
                  }
                  className="border-gray-300 shadow-sm"
                />
              </div>
            ))}


            <div className="space-y-1">
              <label className="text-sm font-medium">About</label>
              <textarea
                rows={3}
                className="border border-gray-300 shadow-sm p-3 rounded-md w-full focus:ring"
                value={tempProfile.about}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, about: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Skills (comma separated)</label>
              <Input
                value={tempProfile.skills.join(", ")}
                onChange={(e) =>
                  setTempProfile({
                    ...tempProfile,
                    skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="border-gray-300 shadow-sm"
              />
            </div>


            {[
              ["github", "Github", faGithub],
              ["linkedin", "LinkedIn", faLinkedin],
              ["twitter", "Twitter", faTwitter],
            ].map(([key, label, icon]) => (
              <div key={key as string} className="space-y-1">
                <label className="text-sm font-medium">{label as string}</label>

                <div className="relative">
                  <FontAwesomeIcon
                    icon={icon as IconDefinition}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <Input
                    value={tempProfile.socials[key as keyof Profile["socials"]]}
                    onChange={(e) =>
                      setTempProfile({
                        ...tempProfile,
                        socials: { ...tempProfile.socials, [key as keyof Profile["socials"]]: e.target.value },
                      })
                    }
                    placeholder={`${label as string} URL`}
                    className="pl-10 border-gray-300 shadow-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button className="w-full" onClick={saveProfile}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
