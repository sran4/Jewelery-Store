"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save, Settings, Mail, Globe, Database } from "lucide-react";
import toast from "react-hot-toast";

interface SiteSettings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
    pinterest?: string;
    snapchat?: string;
    whatsapp?: string;
    telegram?: string;
    discord?: string;
    reddit?: string;
    twitch?: string;
    vimeo?: string;
    behance?: string;
    dribbble?: string;
    github?: string;
    medium?: string;
    clubhouse?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  features: {
    maintenanceMode: boolean;
  };
  promotionalSettings: {
    isActive: boolean;
    message: string;
    showTimer: boolean;
    timerMessage: string;
    saleEndDate?: string;
  };
  updatedAt?: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/admin/login";
    },
  });

  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "SherGill Official",
    siteDescription: "Premium jewelry collection",
    contactEmail: "",
    contactPhone: "",
    address: "",
    socialMedia: {},
    seo: {},
    features: {
      maintenanceMode: false,
    },
    promotionalSettings: {
      isActive: true,
      message: "🎉 Welcome to SherGill Official!",
      showTimer: false,
      timerMessage: "🔥 Sale ends in:",
      saleEndDate: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings?admin=true");
      const data = await res.json();
      console.log("📥 Received settings:", data.settings);
      console.log("📥 Features received:", data.settings?.features);
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    console.log("📤 Sending settings:", settings);
    console.log("📤 Features being sent:", settings.features);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Settings saved successfully!");
        setHasUnsavedChanges(false);
        // Refresh settings to get latest from DB
        await fetchSettings();
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (error) {
      toast.error("An error occurred while saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setHasUnsavedChanges(true);
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    console.log(`🔄 Changing ${parent}.${field} to:`, value);
    setHasUnsavedChanges(true);
    setSettings((prev) => {
      const parentKey = parent as keyof SiteSettings;
      const parentValue = prev[parentKey];
      
      const updated = {
        ...prev,
        [parent]: {
          ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
          [field]: value,
        },
      };
      console.log("🔄 Updated settings:", updated);
      return updated;
    });
  };

  const handleMaintenanceModeToggle = (checked: boolean) => {
    console.log("🚧 Maintenance mode toggle:", checked);
    setHasUnsavedChanges(true);
    setSettings((prev) => ({
      ...prev,
      features: {
        maintenanceMode: checked,
      },
    }));
    console.log("🚧 State updated to:", checked);
  };

  if (status === "loading" || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-serif font-bold">Site Settings</h1>
            <p className="text-muted-foreground">
              Manage your website configuration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Site Name *
                </label>
                <Input
                  value={settings.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Email *
                </label>
                <Input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Phone
                </label>
                <Input
                  value={settings.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <Input
                  value={settings.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Site Description *
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) =>
                  handleInputChange("siteDescription", e.target.value)
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background h-20"
                required
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Social Media Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Facebook URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.facebook || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "facebook",
                      e.target.value
                    )
                  }
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Instagram URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.instagram || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "instagram",
                      e.target.value
                    )
                  }
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Twitter URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.twitter || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "twitter", e.target.value)
                  }
                  placeholder="https://twitter.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  YouTube URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.youtube || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "youtube", e.target.value)
                  }
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  LinkedIn URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.linkedin || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "linkedin",
                      e.target.value
                    )
                  }
                  placeholder="https://linkedin.com/company/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  TikTok URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.tiktok || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "tiktok", e.target.value)
                  }
                  placeholder="https://tiktok.com/@yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pinterest URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.pinterest || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "pinterest",
                      e.target.value
                    )
                  }
                  placeholder="https://pinterest.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Snapchat URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.snapchat || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "snapchat",
                      e.target.value
                    )
                  }
                  placeholder="https://snapchat.com/add/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  WhatsApp Number
                </label>
                <Input
                  type="tel"
                  value={settings.socialMedia.whatsapp || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "whatsapp",
                      e.target.value
                    )
                  }
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Telegram URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.telegram || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "telegram",
                      e.target.value
                    )
                  }
                  placeholder="https://t.me/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Discord URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.discord || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "discord", e.target.value)
                  }
                  placeholder="https://discord.gg/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Reddit URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.reddit || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "reddit", e.target.value)
                  }
                  placeholder="https://reddit.com/r/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Twitch URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.twitch || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "twitch", e.target.value)
                  }
                  placeholder="https://twitch.tv/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Vimeo URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.vimeo || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "vimeo", e.target.value)
                  }
                  placeholder="https://vimeo.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Behance URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.behance || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "behance", e.target.value)
                  }
                  placeholder="https://behance.net/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Dribbble URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.dribbble || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "dribbble",
                      e.target.value
                    )
                  }
                  placeholder="https://dribbble.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.github || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "github", e.target.value)
                  }
                  placeholder="https://github.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Medium URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.medium || ""}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "medium", e.target.value)
                  }
                  placeholder="https://medium.com/@yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Clubhouse URL
                </label>
                <Input
                  type="url"
                  value={settings.socialMedia.clubhouse || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "clubhouse",
                      e.target.value
                    )
                  }
                  placeholder="https://clubhouse.com/@yourpage"
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              SEO Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Title
                </label>
                <Input
                  value={settings.seo.metaTitle || ""}
                  onChange={(e) =>
                    handleNestedChange("seo", "metaTitle", e.target.value)
                  }
                  placeholder="Your site title for search engines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Description
                </label>
                <textarea
                  value={settings.seo.metaDescription || ""}
                  onChange={(e) =>
                    handleNestedChange("seo", "metaDescription", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-border rounded-md bg-background h-20"
                  placeholder="Description for search engines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Keywords (comma-separated)
                </label>
                <Input
                  value={settings.seo.keywords?.join(", ") || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "seo",
                      "keywords",
                      e.target.value.split(", ").filter((k) => k.trim())
                    )
                  }
                  placeholder="jewelry, rings, necklaces, luxury"
                />
              </div>
            </div>
          </div>

          {/* Promotional Bar Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Promotional Bar Settings
            </h2>
            <div className="space-y-6">
              {/* Enable Promotional Bar */}
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    📢 Enable Promotional Bar
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Show promotional message at the top of the site
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.promotionalSettings?.isActive || false}
                      onChange={(e) =>
                        handleNestedChange(
                          "promotionalSettings",
                          "isActive",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {/* Regular Message */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Regular Message
                </label>
                <Input
                  value={settings.promotionalSettings?.message || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "promotionalSettings",
                      "message",
                      e.target.value
                    )
                  }
                  placeholder="🎉 Welcome to SherGill Official!"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {settings.promotionalSettings?.message?.length || 0}/200
                  characters
                </p>
              </div>

              {/* Show Timer Toggle */}
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    ⏰ Show Sale Timer
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Display countdown timer with custom message
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.promotionalSettings?.showTimer || false}
                      onChange={(e) =>
                        handleNestedChange(
                          "promotionalSettings",
                          "showTimer",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {/* Timer Message */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Timer Message
                </label>
                <Input
                  value={settings.promotionalSettings?.timerMessage || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "promotionalSettings",
                      "timerMessage",
                      e.target.value
                    )
                  }
                  placeholder="🔥 Sale ends in:"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {settings.promotionalSettings?.timerMessage?.length || 0}/100
                  characters
                </p>
              </div>

              {/* Sale End Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sale End Date & Time
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={
                        settings.promotionalSettings?.saleEndDate?.split(
                          "T"
                        )[0] || ""
                      }
                      onChange={(e) => {
                        const dateValue = e.target.value;
                        const currentTime =
                          settings.promotionalSettings?.saleEndDate?.split(
                            "T"
                          )[1] || "23:59";
                        if (dateValue) {
                          const newDateTime = `${dateValue}T${currentTime}`;
                          handleNestedChange(
                            "promotionalSettings",
                            "saleEndDate",
                            newDateTime
                          );
                        } else {
                          handleNestedChange(
                            "promotionalSettings",
                            "saleEndDate",
                            ""
                          );
                        }
                      }}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Time
                    </label>
                    <Input
                      type="time"
                      value={
                        settings.promotionalSettings?.saleEndDate?.split(
                          "T"
                        )[1] || ""
                      }
                      onChange={(e) => {
                        const timeValue = e.target.value;
                        const currentDate =
                          settings.promotionalSettings?.saleEndDate?.split(
                            "T"
                          )[0] || new Date().toISOString().split("T")[0];
                        if (timeValue) {
                          const newDateTime = `${currentDate}T${timeValue}`;
                          handleNestedChange(
                            "promotionalSettings",
                            "saleEndDate",
                            newDateTime
                          );
                        } else {
                          handleNestedChange(
                            "promotionalSettings",
                            "saleEndDate",
                            ""
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  When the sale/timer should end (local time) - Must be in the
                  future
                </p>
                {settings.promotionalSettings?.saleEndDate && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Selected:{" "}
                    {new Date(
                      settings.promotionalSettings.saleEndDate
                    ).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Preview */}
              {settings.promotionalSettings?.isActive && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Preview:</h3>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded text-sm">
                    {settings.promotionalSettings?.showTimer &&
                    settings.promotionalSettings?.saleEndDate ? (
                      <span>
                        {settings.promotionalSettings.timerMessage} [Countdown
                        Timer]
                      </span>
                    ) : (
                      <span>{settings.promotionalSettings?.message}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Feature Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium flex items-center gap-2">
                    🚧 Maintenance Mode
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable to show maintenance page to public visitors
                  </p>
                  <p className="text-xs font-semibold mt-2">
                    Current Status:{" "}
                    {settings.features.maintenanceMode ? (
                      <span className="text-orange-600">🔴 MAINTENANCE ON</span>
                    ) : (
                      <span className="text-green-600">🟢 SITE ACTIVE</span>
                    )}
                  </p>
                  {settings.features.maintenanceMode && (
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs">
                      <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                        ℹ️ How to test:
                      </p>
                      <p className="text-blue-600 dark:text-blue-300">
                        • You (admin) can still see the site normally
                        <br />
                        • Public visitors will see maintenance page
                        <br />• Test in incognito/private browser window
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features?.maintenanceMode || false}
                      onChange={(e) =>
                        handleMaintenanceModeToggle(e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Floating Save Banner */}
          {hasUnsavedChanges && (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-orange-500 text-white shadow-2xl border-t-4 border-orange-600">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-bold text-lg">⚠️ Unsaved Changes!</p>
                      <p className="text-sm text-orange-100">
                        Click "Save Changes" to apply your settings
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        fetchSettings();
                        setHasUnsavedChanges(false);
                      }}
                      className="bg-white text-orange-600 hover:bg-orange-50 border-white"
                    >
                      Discard Changes
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {saving ? "Saving..." : "💾 Save Changes Now"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
